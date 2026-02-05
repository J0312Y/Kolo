# Missing Backend Integrations

While core features are 100% integrated, some backend service methods exist but aren't wired to UI yet.

## ❌ Not Wired Yet

### 1. **Notifications - Mark as Read** (HIGH PRIORITY)
**Issue:** Buttons exist in UI but only update local state  
**Location:** `Home.tsx` lines 568-576  
**Service Ready:** ✅ `notificationsService.markAsRead()`, `markAllAsRead()`  
**Backend:** ✅ `/v1/notifications/{id}/read`, `/v1/notifications/read-all`  
**Fix Needed:** Wire click handlers to call backend

---

### 2. **Goals - Update/Delete/Contribute** (MEDIUM PRIORITY)
**Missing Operations:**
- Update goal details
- Delete goal
- Contribute money to goal
- Withdraw from goal
- Get progress

**Service Ready:** ✅ All methods exist in `goalsService`
- `updateGoal(id, data)`
- `deleteGoal(id)`
- `contribute(id, {amount, payment_method})`
- `withdraw(id, amount)`
- `getProgress(id)`

**Backend:** ✅ All endpoints exist
- `PUT /v1/goals/{id}`
- `DELETE /v1/goals/{id}`
- `POST /v1/goals/{id}/contribute`
- `POST /v1/goals/{id}/withdraw`
- `GET /v1/goals/{id}/progress`

**UI Missing:** No buttons/screens for these operations

---

### 3. **Circles - Advanced Operations** (MEDIUM PRIORITY)
**Missing Operations:**
- Discover public circles
- Update circle details
- Delete circle
- Leave circle
- View members list
- Select payout slot
- Validate invitation code before joining

**Service Ready:** ✅ All methods exist
- `discoverCircles()`
- `updateCircle(id, data)`
- `deleteCircle(id)`
- `leaveCircle(id)`
- `getMembers(id)`
- `selectSlot(id, slotNumber)`
- `validateInvitationCode(code)`

**Backend:** ✅ All endpoints exist

**UI Missing:** Most operations have no UI or buttons

---

### 4. **Payments - Contributions** (HIGH PRIORITY)
**Issue:** Users can see upcoming payments but can't actually pay them

**Backend Ready:** ✅ `/v1/payments/contribute`  
**Service Missing:** Need to wire in Wallet or create payment flow

**Impact:** Users can join circles but can't make monthly payments

---

### 5. **Wallet - Balance & Withdrawals** (LOW PRIORITY)
**Missing:**
- View wallet balance (separate from card balance)
- Top up wallet
- Withdraw from wallet
- Filter transactions by type
- Filter transactions by date range

**Service Ready:** ✅ All in `walletService`  
**Backend:** ✅ All endpoints exist  
**UI Missing:** No wallet balance display, only card balance

---

### 6. **Security Logs** (LOW PRIORITY - NO BACKEND)
**Issue:** Backend has NO endpoint for security logs  
**Current:** Mock data only  
**Fix:** Need to create backend endpoint first

---

### 7. **Live Chat (Profile)** (LOW PRIORITY)
**Issue:** Different from group chat - this is support live chat  
**Current:** Uses mock sendLiveChatMessage in AppContext  
**Backend:** No separate live chat endpoint (uses support tickets)  
**Status:** Probably fine as-is, uses support system

---

## 📊 Summary

| Category | Feature | Backend API | Service | UI | Priority |
|----------|---------|-------------|---------|-----|----------|
| Notifications | Mark as read | ✅ | ✅ | ❌ | HIGH |
| Payments | Make contribution | ✅ | ❌ | ❌ | HIGH |
| Goals | Update/Delete | ✅ | ✅ | ❌ | MEDIUM |
| Goals | Contribute/Withdraw | ✅ | ✅ | ❌ | MEDIUM |
| Circles | Discover | ✅ | ✅ | ❌ | MEDIUM |
| Circles | Update/Delete | ✅ | ✅ | ❌ | MEDIUM |
| Circles | Leave | ✅ | ✅ | ❌ | MEDIUM |
| Circles | Members list | ✅ | ✅ | ❌ | MEDIUM |
| Circles | Select slot | ✅ | ✅ | ❌ | MEDIUM |
| Wallet | Balance/Withdrawals | ✅ | ✅ | ❌ | LOW |
| Security | Logs | ❌ | ❌ | ✅ | LOW |

---

## ✅ Quick Wins (Easy to Wire)

### 1. Mark Notifications as Read
**File:** `src/pages/Home.tsx` line 568-576  
**Change:**
```typescript
// Before (local only)
const markAsRead = (id) => {
  setNotifications(notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  ));
};

// After (with backend)
const markAsRead = async (id) => {
  try {
    await notificationsService.markAsRead(id);
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};
```

Same for `markAllAsRead` and same changes in `Circles.tsx` line 1361-1367.

---

## 🎯 High Priority Recommendations

1. **Wire mark as read** (5 min fix, big UX improvement)
2. **Add payment contribution flow** (critical for app functionality)
3. **Add update/delete for goals** (users expect CRUD)
4. **Add leave circle option** (users might want to exit)
5. **Add members list view** (social proof, trust)

---

## 📝 Notes

- All backend APIs exist and are ready
- All service methods exist
- Just need UI components and wiring
- Most are "nice to have" vs critical
- Mark as read and payments are most important

---

