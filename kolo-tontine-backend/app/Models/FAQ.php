<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FAQ extends Model
{
    use HasFactory;

    protected $table = 'faqs';

    protected $fillable = [
        'category',
        'question',
        'answer',
        'language',
        'order',
        'is_published',
        'views_count',
        'helpful_count',
        'not_helpful_count',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'views_count' => 'integer',
        'helpful_count' => 'integer',
        'not_helpful_count' => 'integer',
    ];

    /**
     * Categories: general, account, payment, circles, goals, security
     * Language: en, fr
     */

    /**
     * Scopes
     */
    
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeLanguage($query, $language)
    {
        return $query->where('language', $language);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('created_at');
    }

    public function scopePopular($query)
    {
        return $query->orderByDesc('views_count');
    }

    /**
     * Helper methods
     */
    
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function markHelpful()
    {
        $this->increment('helpful_count');
    }

    public function markNotHelpful()
    {
        $this->increment('not_helpful_count');
    }

    public function getHelpfulPercentage()
    {
        $total = $this->helpful_count + $this->not_helpful_count;
        
        if ($total === 0) {
            return 0;
        }

        return round(($this->helpful_count / $total) * 100, 2);
    }

    /**
     * Static factory methods
     */
    
    public static function getByCategory($category, $language = 'fr')
    {
        return static::published()
            ->category($category)
            ->language($language)
            ->ordered()
            ->get();
    }

    public static function search($query, $language = 'fr')
    {
        return static::published()
            ->language($language)
            ->where(function($q) use ($query) {
                $q->where('question', 'LIKE', "%{$query}%")
                  ->orWhere('answer', 'LIKE', "%{$query}%");
            })
            ->ordered()
            ->get();
    }

    public static function getPopular($limit = 10, $language = 'fr')
    {
        return static::published()
            ->language($language)
            ->popular()
            ->limit($limit)
            ->get();
    }
}
