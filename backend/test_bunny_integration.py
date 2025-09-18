"""
Test script for Bunny CDN integration
This script demonstrates how to use the Bunny CDN integration
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from content.models import Module, Lesson
from content.bunny_utils import (
    validate_bunny_video_id,
    get_bunny_video_url,
    get_bunny_embed_url,
    update_module_bunny_video,
    update_lesson_bunny_video
)


def test_bunny_integration():
    """Test Bunny CDN integration functionality"""
    
    print("=== Bunny CDN Integration Test ===\n")
    
    # Test 1: Check if Bunny CDN is configured
    from django.conf import settings
    api_key = getattr(settings, 'BUNNY_CDN_API_KEY', None)
    library_id = getattr(settings, 'BUNNY_CDN_LIBRARY_ID', None)
    
    print("1. Configuration Check:")
    print(f"   API Key configured: {'Yes' if api_key else 'No'}")
    print(f"   Library ID configured: {'Yes' if library_id else 'No'}")
    print()
    
    if not api_key or not library_id:
        print("   ⚠️  Bunny CDN not configured. Please set BUNNY_CDN_API_KEY and BUNNY_CDN_LIBRARY_ID")
        print("   in your environment variables or .env file")
        return
    
    # Test 2: Test video validation (you'll need to replace with actual video ID)
    test_video_id = "your-test-video-id"  # Replace with actual Bunny CDN video ID
    print("2. Video Validation Test:")
    print(f"   Testing video ID: {test_video_id}")
    
    try:
        is_valid = validate_bunny_video_id(test_video_id)
        print(f"   Video valid: {'Yes' if is_valid else 'No'}")
        
        if is_valid:
            video_url = get_bunny_video_url(test_video_id)
            print(f"   Video URL: {video_url}")
            
            embed_url = get_bunny_embed_url(test_video_id)
            print(f"   Embed URL: {embed_url}")
    except Exception as e:
        print(f"   Error: {str(e)}")
    print()
    
    # Test 3: Test model methods
    print("3. Model Methods Test:")
    
    # Get first module and lesson for testing
    try:
        module = Module.objects.first()
        lesson = Lesson.objects.first()
        
        if module:
            print(f"   Testing Module: {module.name}")
            print(f"   Has Bunny video: {module.has_bunny_video}")
            print(f"   Video source: {module.video_source}")
            print(f"   Video URL: {module.get_video_url()}")
        
        if lesson:
            print(f"   Testing Lesson: {lesson.title}")
            print(f"   Has Bunny video: {lesson.has_bunny_video}")
            print(f"   Video source: {lesson.video_source}")
            print(f"   Video URL: {lesson.get_video_url()}")
            
    except Exception as e:
        print(f"   Error: {str(e)}")
    print()
    
    # Test 4: Test updating models with Bunny video
    print("4. Model Update Test:")
    print("   (This test requires a valid Bunny video ID)")
    
    if module and test_video_id != "your-test-video-id":
        try:
            success = update_module_bunny_video(module, test_video_id)
            print(f"   Module update success: {'Yes' if success else 'No'}")
            if success:
                print(f"   Updated module video URL: {module.bunny_video_url}")
        except Exception as e:
            print(f"   Error updating module: {str(e)}")
    
    if lesson and test_video_id != "your-test-video-id":
        try:
            success = update_lesson_bunny_video(lesson, test_video_id)
            print(f"   Lesson update success: {'Yes' if success else 'No'}")
            if success:
                print(f"   Updated lesson video URL: {lesson.bunny_video_url}")
        except Exception as e:
            print(f"   Error updating lesson: {str(e)}")
    
    print("\n=== Test Complete ===")


def show_usage_examples():
    """Show usage examples for Bunny CDN integration"""
    
    print("\n=== Usage Examples ===\n")
    
    print("1. Adding Bunny video to a module:")
    print("""
    from content.bunny_utils import update_module_bunny_video
    
    module = Module.objects.get(id=1)
    success = update_module_bunny_video(module, "your-bunny-video-id")
    
    if success:
        print(f"Video URL: {module.bunny_video_url}")
    """)
    
    print("2. Adding Bunny video to a lesson:")
    print("""
    from content.bunny_utils import update_lesson_bunny_video
    
    lesson = Lesson.objects.get(id=1)
    success = update_lesson_bunny_video(lesson, "your-bunny-video-id")
    
    if success:
        print(f"Video URL: {lesson.bunny_video_url}")
    """)
    
    print("3. Checking if content has Bunny video:")
    print("""
    # For Module
    if module.has_bunny_video:
        video_url = module.get_video_url()
        print(f"Playing Bunny video: {video_url}")
    
    # For Lesson  
    if lesson.has_bunny_video:
        video_url = lesson.get_video_url()
        print(f"Playing Bunny video: {video_url}")
    """)
    
    print("4. Generating embed URL:")
    print("""
    from content.bunny_utils import get_bunny_embed_url
    
    embed_url = get_bunny_embed_url(
        video_id="your-video-id",
        autoplay=False,
        loop=False,
        muted=False,
        start_time=0
    )
    
    # Use in HTML
    html = f'<iframe src="{embed_url}" width="800" height="450" frameborder="0"></iframe>'
    """)
    
    print("5. API Usage:")
    print("""
    # Validate video
    POST /api/content/bunny/validate/
    {
        "video_id": "your-bunny-video-id"
    }
    
    # Update module with Bunny video
    POST /api/content/modules/{module_id}/bunny-video/
    {
        "video_id": "your-bunny-video-id"
    }
    
    # Get video information
    GET /api/content/bunny/video/{video_id}/
    
    # Get embed URL
    GET /api/content/bunny/embed/{video_id}/?autoplay=false&loop=false&muted=false&start_time=0
    """)


if __name__ == "__main__":
    test_bunny_integration()
    show_usage_examples()
