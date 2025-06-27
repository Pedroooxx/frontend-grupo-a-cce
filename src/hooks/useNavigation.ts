import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom navigation hook that provides robust routing functionality
 * with error handling and fallback mechanisms
 */
export const useNavigation = () => {
  const router = useRouter();

  /**
   * Navigate to a route with error handling and retry logic
   */
  const navigateTo = useCallback(async (path: string, options: { replace?: boolean; retries?: number } = {}) => {
    const { replace = false, retries = 2 } = options;
    
    let attempt = 0;
    
    while (attempt <= retries) {
      try {
        console.log(`Navigation attempt ${attempt + 1} to: ${path}`);
        
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
        
        // Wait a bit to see if navigation succeeded
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
        
      } catch (error) {
        console.error(`Navigation attempt ${attempt + 1} failed:`, error);
        attempt++;
        
        if (attempt <= retries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
    
    // If all attempts failed, try a hard navigation as fallback
    console.warn(`All navigation attempts failed for ${path}, falling back to window.location`);
    try {
      window.location.href = path;
      return true;
    } catch (error) {
      console.error('Hard navigation also failed:', error);
      return false;
    }
  }, [router]);

  /**
   * Navigate to championship page
   */
  const navigateToChampionship = useCallback((championshipId: number) => {
    return navigateTo(`/campeonatos/${championshipId}`);
  }, [navigateTo]);

  /**
   * Navigate to team page within a championship
   */
  const navigateToTeam = useCallback((championshipId: number, teamId: number) => {
    return navigateTo(`/campeonatos/${championshipId}/equipes/${teamId}`);
  }, [navigateTo]);

  /**
   * Navigate to match page within a championship
   */
  const navigateToMatch = useCallback((championshipId: number, matchId: number) => {
    return navigateTo(`/campeonatos/${championshipId}/partidas/${matchId}`);
  }, [navigateTo]);

  /**
   * Navigate to dashboard team page
   */
  const navigateToDashboardTeam = useCallback((teamId: number) => {
    return navigateTo(`/dashboard/equipes/${teamId}`);
  }, [navigateTo]);

  return {
    navigateTo,
    navigateToChampionship,
    navigateToTeam,
    navigateToMatch,
    navigateToDashboardTeam
  };
};