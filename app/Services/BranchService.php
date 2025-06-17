<?php

namespace App\Services;

use App\Models\Branch;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BranchService
{
    private const API_URL = 'http://almacen.fastnetperu.com.pe/api/branches';
    private const CACHE_KEY = 'branches_data';
    private const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get branches from API and cache them
     */
    public function getBranches(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_DURATION, function () {
            try {
                $response = Http::timeout(10)->get(self::API_URL);

                if ($response->successful()) {
                    $data = $response->json();
                    
                    if ($data['status'] === 200 && isset($data['data'])) {
                        // Sync branches with local database
                        $this->syncBranches($data['data']);
                        
                        return $data['data'];
                    }
                }

                // Fallback to local database
                return $this->getLocalBranches();
                
            } catch (\Exception $e) {
                Log::error('Error fetching branches from API: ' . $e->getMessage());
                
                // Fallback to local database
                return $this->getLocalBranches();
            }
        });
    }

    /**
     * Sync branches with local database
     */
    private function syncBranches(array $branches): void
    {
        foreach ($branches as $branchData) {
            Branch::updateOrCreate(
                ['external_id' => $branchData['id']],
                [
                    'name' => $branchData['name'],
                    'correlative' => $branchData['correlative'],
                    'ubigeo' => $branchData['ubigeo'],
                    'address' => $branchData['address'],
                    'description' => $branchData['description'],
                    'color' => $branchData['color'],
                    'status' => $branchData['status'] === 1,
                ]
            );
        }
    }

    /**
     * Get branches from local database as fallback
     */
    private function getLocalBranches(): array
    {
        return Branch::where('status', true)
            ->get()
            ->map(function ($branch) {
                return [
                    'id' => $branch->external_id,
                    'name' => $branch->name,
                    'correlative' => $branch->correlative,
                    'ubigeo' => $branch->ubigeo,
                    'address' => $branch->address,
                    'description' => $branch->description,
                    'color' => $branch->color,
                    'status' => $branch->status ? 1 : 0,
                ];
            })
            ->toArray();
    }

    /**
     * Clear branches cache
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Refresh branches data
     */
    public function refresh(): array
    {
        $this->clearCache();
        return $this->getBranches();
    }
}
