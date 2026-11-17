# Digital Saathi Firestore Security Specification

## 1. Data Invariants
1. Every document under `/users/{userId}` and its subcollections belongs exclusively to the verified user whose `request.auth.uid == userId`.
2. Unverified or unauthenticated requests (`request.auth == null` or `email_verified != true`) cannot read or write any document.
3. No PII (email, phone, home address) is stored in Firestore profiles; `displayName` is bounded to 80 characters.
4. All IDs (`userId`, `lessonId`, `entryId`, `requestId`, `volunteerId`) must match `^[a-zA-Z0-9_-]+$` and be <= 128 chars (or <= 64 chars for sub-IDs).
5. All `createdAt`, `updatedAt`, and `completedAt` timestamps must equal `request.time`.
6. Once a `HelpRequest` transitions from `submitted` to `resolved` or `cancelled`, it reaches a terminal state and cannot be updated again.
7. Shadow fields (unlisted keys) are strictly rejected on both `create` (`hasAll` + `hasOnly`) and `update` (`affectedKeys().hasOnly()`).

## 2. Adversarial Scenarios Verified
1. Cross-user read on `/users/{otherUid}` -> `PERMISSION_DENIED`
2. Unauthenticated write to `/users/{uid}/helpRequests/{id}` -> `PERMISSION_DENIED`
3. Unverified email (`email_verified: false`) create on `/users/{uid}` -> `PERMISSION_DENIED`
4. Identity spoofing (`userId` in payload != `request.auth.uid`) -> `PERMISSION_DENIED`
5. Shadow field injection (`isAdmin: true`) on `UserProfile` create -> `PERMISSION_DENIED`
6. Oversized string (> 600 chars in `description`) -> `PERMISSION_DENIED`
7. Malicious path ID (`../admin`) -> `PERMISSION_DENIED`
8. Fake client timestamp (`createdAt != request.time`) -> `PERMISSION_DENIED`
9. Mutating `createdAt` or `uid` on update -> `PERMISSION_DENIED`
10. Reopening a terminal `HelpRequest` (`resolved` -> `submitted`) -> `PERMISSION_DENIED`
11. Unbounded or invalid-type `steps` array in `SavedChatEntry` -> `PERMISSION_DENIED`
12. Query listing another user's subcollection -> `PERMISSION_DENIED`
