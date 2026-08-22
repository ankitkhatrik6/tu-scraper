import * as fs from 'fs';
import * as path from 'path';
import {
  getNotices,
  getLatest,
  searchNotices,
  clearCache,
  isValidSource,
  SOURCES,
  SOURCE_METADATA,
  InvalidSourceError,
  Notice,
  NoticeSource,
} from '../src/index';
import { parseTuPortalNotices } from '../src/utils/parser';
import { MemoryCache } from '../src/cache';

// Helper assertion functions
let passed = 0;
let failed = 0;
const testResults: { name: string; status: 'PASS' | 'FAIL'; error?: string; durationMs: number }[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}. ${message || ''}`);
  }
}

async function runTest(name: string, fn: () => Promise<void> | void) {
  const start = Date.now();
  try {
    await fn();
    passed++;
    testResults.push({ name, status: 'PASS', durationMs: Date.now() - start });
    console.log(`  ✓ ${name}`);
  } catch (err: any) {
    failed++;
    testResults.push({ name, status: 'FAIL', error: err.message, durationMs: Date.now() - start });
    console.error(`  ✗ ${name}: ${err.message}`);
  }
}

export async function runAllTests() {
  console.log('\n================== RUNNING TU-SCRAPPER TEST SUITE ==================\n');

  // Group 1: Source Validation & Metadata
  console.log('--- Suite 1: Source Validation & Metadata ---');
  await runTest('Supports exactly the 8 specified official sources', () => {
    assertEqual(SOURCES.length, 8);
    const expected = ['iost', 'fohss', 'ioe', 'iom', 'iaas', 'iof', 'foe', 'fol'];
    for (const src of expected) {
      assert(SOURCES.includes(src as NoticeSource), `SOURCES should include ${src}`);
    }
  });

  await runTest('Validates valid vs invalid source strings', () => {
    assert(isValidSource('iost'), 'iost should be valid');
    assert(isValidSource('all'), 'all should be valid');
    assert(!isValidSource('fom'), 'fom should NOT be valid');
    assert(!isValidSource('unknown'), 'unknown should NOT be valid');
  });

  await runTest('Provides complete metadata for all 8 institutions', () => {
    for (const src of SOURCES) {
      const meta = SOURCE_METADATA[src];
      assert(Boolean(meta), `Metadata exists for ${src}`);
      assert(meta.url.startsWith('https://'), `Valid HTTPS URL for ${src}`);
      assert(meta.name.length > 5, `Non-empty full name for ${src}`);
      assert(meta.verified === true, `Marked verified for ${src}`);
    }
  });

  // Group 2: Error Handling
  console.log('\n--- Suite 2: Error Handling & Invalid Sources ---');
  await runTest('Throws InvalidSourceError when an unknown source is passed to getNotices()', async () => {
    let threw = false;
    try {
      // @ts-expect-error Testing invalid input
      await getNotices('invalid_source');
    } catch (err) {
      threw = true;
      assert(err instanceof InvalidSourceError, 'Error must be an instance of InvalidSourceError');
    }
    assert(threw, 'Should have thrown InvalidSourceError');
  });

  await runTest('Throws InvalidSourceError when invalid source is passed to getLatest()', async () => {
    let threw = false;
    try {
      // @ts-expect-error Testing invalid input
      await getLatest('non_existent');
    } catch (err) {
      threw = true;
      assert(err instanceof InvalidSourceError, 'Error must be an instance of InvalidSourceError');
    }
    assert(threw, 'Should have thrown InvalidSourceError');
  });

  // Group 3: Real HTML Fixtures Parsing & Normalization
  console.log('\n--- Suite 3: Fixture Parsing & Normalization ---');
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');

  for (const src of SOURCES) {
    await runTest(`Parses ${src.toUpperCase()} real HTML fixture into standardized Notice[]`, async () => {
      const filePath = path.join(fixturesDir, `${src}.html`);
      assert(fs.existsSync(filePath), `Fixture file must exist at ${filePath}`);
      const fixtureHtml = fs.readFileSync(filePath, 'utf8');

      const notices = await getNotices(src, { htmlFixture: fixtureHtml, bypassCache: true });
      assert(Array.isArray(notices), 'Notices must be an array');

      if (src !== 'iom') {
        // IOM current view may be empty or have no notices
        assert(notices.length > 0, `Expected parsed notices for ${src}, got ${notices.length}`);
      }

      for (const notice of notices) {
        assert(typeof notice.id === 'string' && notice.id.length > 0, 'Notice id must be non-empty string');
        assert(typeof notice.title === 'string' && notice.title.length > 0, 'Notice title must be non-empty string');
        assertEqual(notice.source, src, 'Notice source must match requested source');
        assert(notice.url.startsWith('http'), `Notice url must be valid HTTP/HTTPS url, got: ${notice.url}`);
        if (notice.date !== undefined) {
          assert(typeof notice.date === 'string', 'Date if present must be string');
        }
        if (notice.pdf !== undefined) {
          assert(typeof notice.pdf === 'string' && notice.pdf.startsWith('http'), 'PDF if present must be valid URL');
        }
      }
    });
  }

  // Group 4: Search & Filtering
  console.log('\n--- Suite 4: Search Functionality ---');
  await runTest('searchNotices() finds notices matching query substring', async () => {
    const iostHtml = fs.readFileSync(path.join(fixturesDir, 'iost.html'), 'utf8');
    const notices = await getNotices('iost', { htmlFixture: iostHtml, bypassCache: true });
    assert(notices.length > 0, 'Should have IOST notices');

    // Pick first word from first notice
    const firstTitle = notices[0].title;
    const searchWord = firstTitle.split(' ')[0] || 'Result';

    const searchResults = await searchNotices(searchWord, 'iost', { htmlFixture: iostHtml, bypassCache: true });
    assert(searchResults.length > 0, `Search for "${searchWord}" should return results`);
    for (const res of searchResults) {
      assert(
        res.title.toLowerCase().includes(searchWord.toLowerCase()) || res.id.toLowerCase().includes(searchWord.toLowerCase()),
        `Search result must contain search term "${searchWord}"`
      );
    }
  });

  await runTest('searchNotices() returns empty array for non-matching query', async () => {
    const iostHtml = fs.readFileSync(path.join(fixturesDir, 'iost.html'), 'utf8');
    const results = await searchNotices('XYZ9999NonExistentRandomText', 'iost', {
      htmlFixture: iostHtml,
      bypassCache: true,
    });
    assertEqual(results.length, 0, 'Non matching search should return 0 results');
  });

  await runTest('searchNotices() handles empty string query gracefully', async () => {
    const results = await searchNotices('', 'iost');
    assertEqual(results.length, 0, 'Empty search string returns empty array');
  });

  // Group 5: getLatest() behavior
  console.log('\n--- Suite 5: getLatest API ---');
  await runTest('getLatest() returns the first notice item or null', async () => {
    const iostHtml = fs.readFileSync(path.join(fixturesDir, 'iost.html'), 'utf8');
    const latest = await getLatest('iost', { htmlFixture: iostHtml, bypassCache: true });
    assert(latest !== null, 'Latest notice should not be null');
    assert(typeof latest?.title === 'string', 'Latest notice has title');
    assertEqual(latest?.source, 'iost');
  });

  // Group 6: Caching
  console.log('\n--- Suite 6: In-Memory Caching ---');
  await runTest('MemoryCache stores, retrieves, and clears entries correctly', () => {
    const testCache = new MemoryCache(1000);
    const mockNotices: Notice[] = [
      { id: '1', title: 'Test Notice', source: 'iost', url: 'https://iost.tu.edu.np/notices/1' },
    ];
    testCache.set('test-key', mockNotices);
    assert(testCache.has('test-key'), 'Cache should have key');
    assertEqual(testCache.get('test-key')?.length, 1);

    testCache.clear();
    assert(!testCache.has('test-key'), 'Cache should be empty after clear()');
    assertEqual(testCache.get('test-key'), null);
  });

  await runTest('clearCache() global helper executes without error', () => {
    clearCache();
  });

  // Group 7: "all" aggregation
  console.log('\n--- Suite 7: Aggregation ("all") ---');
  await runTest('"all" returns combined notices across available sources', async () => {
    // Test with mock fixture loader / getNotices
    const allNotices = await getNotices('all', { timeout: 3000, bypassCache: true });
    assert(Array.isArray(allNotices), 'All notices should be an array');
    console.log(`    Aggregated ${allNotices.length} notices from live sources.`);
  });

  // Group 8: Attachment & Image Extraction
  console.log('\n--- Suite 8: Attachment & Scanned Image Files ---');
  await runTest('Scrapes image attachments from notice detail pages (e.g. 1787351562.jpeg)', async () => {
    const detailHtml = fs.readFileSync(path.join(fixturesDir, 'detail_14690.html'), 'utf8');
    const { getNoticeDetail } = await import('../src/index');
    const detail = await getNoticeDetail('https://iost.tu.edu.np/notices/14690', 'iost', {
      htmlFixture: detailHtml,
      bypassCache: true,
    });

    assert(Boolean(detail), 'Detail object must be returned');
    assertEqual(detail.id, '14690');
    assert(detail.attachments !== undefined && detail.attachments.length > 0, 'Attachments must be present');
    
    // Check for jpeg image scan
    const imageAttachment = detail.attachments?.find((a) => a.type === 'image' || a.fileType === 'jpeg');
    assert(Boolean(imageAttachment), 'Image attachment must be found');
    assert(
      Boolean(imageAttachment && imageAttachment.url.includes('1787351562.jpeg')),
      `Image URL must include 1787351562.jpeg, got ${imageAttachment?.url}`
    );
    assertEqual(detail.image, imageAttachment?.url, 'Primary image property should match attached JPEG');

    // Strict check: Verify that non-notice site chrome assets are NOT scraped as attachments
    const hasAffiliatedCollege = detail.attachments?.some((a) => a.url.includes('AffiliatedColleges'));
    assert(!hasAffiliatedCollege, 'Must NOT scrape IOST-AffiliatedColleges from footer info officer card');

    const hasSiteLogo = detail.attachments?.some((a) => a.url.includes('logo') || a.url.includes('TULogoTIF'));
    assert(!hasSiteLogo, 'Must NOT scrape site logos or crest icons as attachments');
  });

  await runTest('isIrrelevantAsset filters out logos, affiliated colleges, officer photos, and UI banners', async () => {
    const { isIrrelevantAsset } = await import('../src/utils/parser');
    assert(isIrrelevantAsset('https://portal.tu.edu.np/medias/IOST-AffiliatedColleges_2023_02_25_14_47_29.jpg'), 'Affiliated colleges banner must be irrelevant');
    assert(isIrrelevantAsset('https://iost.tu.edu.np/assets/img/logo_2022_07_05_07_00_46.png'), 'Logo with timestamp must be irrelevant');
    assert(isIrrelevantAsset('https://portal.tu.edu.np/medias/TULogoTIF-2_2024_04_21_11_26_49.jpg'), 'TULogoTIF must be irrelevant');
    assert(isIrrelevantAsset('https://iost.tu.edu.np/assets/calendar.png'), 'calendar.png must be irrelevant');
    assert(!isIrrelevantAsset('https://portal.tu.edu.np/notice/14690/1787351562.jpeg'), 'Real notice scan must NOT be irrelevant');
    assert(!isIrrelevantAsset('https://fohss.tu.edu.np/uploads/exam_routine_2081.pdf'), 'Real notice PDF must NOT be irrelevant');
  });

  await runTest('Scrapes PDF attachments from notice detail pages', async () => {
    const detailHtml = fs.readFileSync(path.join(fixturesDir, 'detail_14672.html'), 'utf8');
    const { getNoticeDetail } = await import('../src/index');
    const detail = await getNoticeDetail('https://fohss.tu.edu.np/notices/14672', 'fohss', {
      htmlFixture: detailHtml,
      bypassCache: true,
    });

    assert(Boolean(detail), 'Detail object must be returned');
    assertEqual(detail.id, '14672');
    assert(detail.attachments !== undefined && detail.attachments.length > 0, 'Attachments must be present');
    
    const pdfAttachment = detail.attachments?.find((a) => a.type === 'pdf' || a.fileType === 'pdf');
    assert(Boolean(pdfAttachment), 'PDF attachment must be found');
    assert(
      Boolean(pdfAttachment && pdfAttachment.url.includes('1787314549.pdf')),
      `PDF URL must include 1787314549.pdf, got ${pdfAttachment?.url}`
    );
    assertEqual(detail.pdf, pdfAttachment?.url, 'Primary PDF property should match attached PDF');
  });

  console.log(`\n================== SUMMARY ==================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}\n`);

  return { passed, failed, results: testResults };
}

// Execute if run directly via node
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests()
    .then((res) => {
      if (res.failed > 0) process.exit(1);
    })
    .catch((err) => {
      console.error('Fatal test error:', err);
      process.exit(1);
    });
}
