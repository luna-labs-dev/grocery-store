# Research: Cart Workflow Completion

## Decision: Open Food Facts (OFF) Integration
**Rationale**: Primary external source due to OSS alignment and extensive global database.
**Alternatives considered**: UPCitemdb (used as secondary fallback).
**Implementation Pattern**: Use `HttpService` from NestJS with `Axios` interceptors or wrapping in a dedicated `ExternalProductClient`.

## Decision: Variable-Weight Barcode Parsing
**Rationale**: GS1-128 or EAN-13 starting with '2' are standard. EAN-13 starting with '2' (e.g., 2XXXXXXWVYYYC) typically embeds item ID and weight or price. 
**Implementation Pattern**: Custom parser in Domain service.

## Decision: Circuit Breaker
**Rationale**: Required by Constitution (Principle V) to prevent external API failures from cascading.
**Implementation Pattern**: NestJS `CircuitBreaker` or a simple wrapper around `axios` with timeout.
