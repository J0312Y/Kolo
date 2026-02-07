<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get all notifications for authenticated user
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            $query = Notification::where('user_id', $user->id);

            // Filter by type if provided
            if ($request->has('type')) {
                $query->type($request->type);
            }

            // Filter by read status if provided
            if ($request->has('read')) {
                if ($request->read === 'true' || $request->read === '1') {
                    $query->read();
                } else {
                    $query->unread();
                }
            }

            // Order by most recent first
            $notifications = $query->orderBy('created_at', 'desc')
                                   ->limit(100)
                                   ->get();

            // Format notifications for response
            $formattedNotifications = $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at?->toISOString(),
                    'is_read' => $notification->isRead(),
                    'created_at' => $notification->created_at->toISOString(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedNotifications,
                'unread_count' => Notification::where('user_id', $user->id)->unread()->count(),
                'message' => 'Notifications retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread notifications
     */
    public function getUnread()
    {
        try {
            $user = Auth::user();

            $notifications = Notification::where('user_id', $user->id)
                                         ->unread()
                                         ->orderBy('created_at', 'desc')
                                         ->get();

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'count' => $notifications->count(),
                'message' => 'Unread notifications retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve unread notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead($id)
    {
        try {
            $user = Auth::user();

            $notification = Notification::where('user_id', $user->id)
                                        ->findOrFail($id);

            $notification->markAsRead();

            return response()->json([
                'success' => true,
                'data' => $notification->fresh(),
                'message' => 'Notification marked as read'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        try {
            $user = Auth::user();

            Notification::where('user_id', $user->id)
                        ->unread()
                        ->update(['read_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all notifications as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a notification
     */
    public function delete($id)
    {
        try {
            $user = Auth::user();

            $notification = Notification::where('user_id', $user->id)
                                        ->findOrFail($id);

            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
