import { NoticeSource } from './types';

/**
 * Base error class for tu-scraper
 */
export class TuScrapperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TuScrapperError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when an unrecognized source identifier is provided
 */
export class InvalidSourceError extends TuScrapperError {
  public readonly invalidSource: string;
  public readonly allowedSources: string[];

  constructor(source: string, allowed: string[] = ['iost', 'fohss', 'ioe', 'ac', 'iaas', 'iof', 'foe', 'fol', 'all']) {
    super(
      `Invalid notice source "${source}". Supported sources are: ${allowed.map(s => `"${s}"`).join(', ')}.`
    );
    this.name = 'InvalidSourceError';
    this.invalidSource = source;
    this.allowedSources = allowed;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when a network or HTTP request fails
 */
export class NetworkError extends TuScrapperError {
  public readonly url: string;
  public readonly statusCode?: number;
  public readonly originalError?: Error;

  constructor(url: string, message: string, statusCode?: number, originalError?: Error) {
    super(`Network request failed for "${url}": ${message}${statusCode ? ` (HTTP ${statusCode})` : ''}`);
    this.name = 'NetworkError';
    this.url = url;
    this.statusCode = statusCode;
    this.originalError = originalError;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when a request exceeds the configured timeout duration
 */
export class TimeoutError extends TuScrapperError {
  public readonly url: string;
  public readonly timeoutMs: number;

  constructor(url: string, timeoutMs: number) {
    super(`Request to "${url}" timed out after ${timeoutMs}ms.`);
    this.name = 'TimeoutError';
    this.url = url;
    this.timeoutMs = timeoutMs;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when the HTML structure cannot be parsed or expected elements are missing
 */
export class ParseError extends TuScrapperError {
  public readonly source: NoticeSource;
  public readonly url: string;

  constructor(source: NoticeSource, url: string, message: string) {
    super(`Failed to parse notices from ${source.toUpperCase()} (${url}): ${message}`);
    this.name = 'ParseError';
    this.source = source;
    this.url = url;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
