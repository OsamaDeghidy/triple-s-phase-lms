"""
Test script for Bunny CDN API integration
This script tests the actual API endpoints
"""
import os
import sys
import django
import requests
import json

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from content.bunny_utils import BunnyCDNClient


def test_bunny_api_connection():
    """Test connection to Bunny CDN API"""
    
    print("=== Bunny CDN API Connection Test ===\n")
    
    # Get configuration
    api_key = getattr(settings, 'BUNNY_CDN_API_KEY', None)
    library_id = getattr(settings, 'BUNNY_CDN_LIBRARY_ID', None)
    
    print(f"API Key: {api_key[:10]}..." if api_key else "API Key: Not configured")
    print(f"Library ID: {library_id}")
    print()
    
    if not api_key or not library_id:
        print("❌ Bunny CDN not configured properly")
        return False
    
    # Test API connection
    try:
        client = BunnyCDNClient()
        
        # Test getting library info
        url = f"https://video.bunnycdn.com/library/{library_id}"
        headers = {
            'AccessKey': api_key,
            'Content-Type': 'application/json'
        }
        
        print("Testing API connection...")
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            library_info = response.json()
            print("✅ API connection successful!")
            print(f"Library Name: {library_info.get('Name', 'N/A')}")
            print(f"Library Status: {library_info.get('Status', 'N/A')}")
            print(f"Total Videos: {library_info.get('VideoCount', 0)}")
            print()
            return True
        else:
            print(f"❌ API connection failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error connecting to API: {str(e)}")
        return False


def list_videos():
    """List videos in the library"""
    
    print("=== Listing Videos in Library ===\n")
    
    try:
        client = BunnyCDNClient()
        api_key = getattr(settings, 'BUNNY_CDN_API_KEY', None)
        library_id = getattr(settings, 'BUNNY_CDN_LIBRARY_ID', None)
        
        url = f"https://video.bunnycdn.com/library/{library_id}/videos"
        headers = {
            'AccessKey': api_key,
            'Content-Type': 'application/json'
        }
        
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            videos_data = response.json()
            print(f"Raw response: {videos_data}")
            
            # Handle different response formats
            if isinstance(videos_data, dict):
                videos = videos_data.get('items', [])
            elif isinstance(videos_data, list):
                videos = videos_data
            else:
                videos = []
            
            print(f"Found {len(videos)} videos:")
            print()
            
            for i, video in enumerate(videos[:5]):  # Show first 5 videos
                print(f"{i+1}. Video ID: {video.get('guid', 'N/A')}")
                print(f"   Title: {video.get('title', 'N/A')}")
                print(f"   Status: {video.get('status', 'N/A')}")
                print(f"   Length: {video.get('length', 0)} seconds")
                print(f"   Created: {video.get('dateCreated', 'N/A')}")
                print()
            
            if len(videos) > 5:
                print(f"... and {len(videos) - 5} more videos")
            
            return videos
        else:
            print(f"❌ Failed to list videos: {response.status_code}")
            print(f"Response: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Error listing videos: {str(e)}")
        return []


def test_video_validation(video_id):
    """Test video validation"""
    
    print(f"=== Testing Video Validation: {video_id} ===\n")
    
    try:
        client = BunnyCDNClient()
        video_info = client.get_video_info(video_id)
        
        if video_info:
            print("✅ Video found!")
            print(f"Title: {video_info.get('title', 'N/A')}")
            print(f"Status: {video_info.get('status', 'N/A')}")
            print(f"Length: {video_info.get('length', 0)} seconds")
            print(f"Playable URL: {video_info.get('playableUrl', 'N/A')}")
            print(f"Created: {video_info.get('dateCreated', 'N/A')}")
            print()
            return True
        else:
            print("❌ Video not found")
            return False
            
    except Exception as e:
        print(f"❌ Error validating video: {str(e)}")
        return False


def test_embed_url_generation(video_id):
    """Test embed URL generation"""
    
    print(f"=== Testing Embed URL Generation: {video_id} ===\n")
    
    try:
        from content.bunny_utils import get_bunny_embed_url, get_bunny_direct_url
        
        # Test embed URL
        embed_url = get_bunny_embed_url(
            video_id=video_id,
            autoplay=False,
            loop=False,
            muted=False,
            start_time=0
        )
        
        print(f"Embed URL: {embed_url}")
        
        # Test direct URL
        direct_url = get_bunny_direct_url(video_id)
        print(f"Direct URL: {direct_url}")
        
        print()
        return True
        
    except Exception as e:
        print(f"❌ Error generating URLs: {str(e)}")
        return False


def main():
    """Main test function"""
    
    print("Bunny CDN API Integration Test")
    print("=" * 50)
    print()
    
    # Test 1: API Connection
    if not test_bunny_api_connection():
        print("❌ Cannot proceed without API connection")
        return
    
    # Test 2: List Videos
    videos = list_videos()
    
    if not videos:
        print("❌ No videos found in library")
        print("Please upload a video to your Bunny CDN library first")
        return
    
    # Test 3: Test with first video
    if videos:
        first_video = videos[0]
        video_id = first_video.get('guid')
        
        if video_id:
            # Test video validation
            if test_video_validation(video_id):
                # Test embed URL generation
                test_embed_url_generation(video_id)
                
                print("✅ All tests passed!")
                print()
                print("You can now use this video ID in your LMS:")
                print(f"Video ID: {video_id}")
                print()
                print("Example usage:")
                print(f"""
# In Django shell or code:
from content.bunny_utils import update_module_bunny_video
from content.models import Module

module = Module.objects.first()
success = update_module_bunny_video(module, "{video_id}")
if success:
    print(f"Video URL: {{module.bunny_video_url}}")
                """)
            else:
                print("❌ Video validation failed")
        else:
            print("❌ No valid video ID found")
    
    print("\n" + "=" * 50)
    print("Test completed!")


if __name__ == "__main__":
    main()
