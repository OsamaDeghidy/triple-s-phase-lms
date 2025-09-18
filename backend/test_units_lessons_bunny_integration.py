#!/usr/bin/env python
"""
Test script for Units and Lessons Bunny CDN integration
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from content.models import Module, Lesson
from content.bunny_utils import update_module_bunny_video, update_lesson_bunny_video, BunnyCDNClient

def test_units_lessons_bunny_integration():
    """Test Units and Lessons Bunny CDN integration"""
    print("🎬 Testing Units and Lessons Bunny CDN Integration")
    print("=" * 60)
    
    # Test 1: Check if Module model has Bunny fields
    print("\n1. Testing Module model fields...")
    module_fields = [field.name for field in Module._meta.fields]
    bunny_fields = ['bunny_video_id', 'bunny_video_url']
    
    for field in bunny_fields:
        if field in module_fields:
            print(f"✅ {field} field exists in Module")
        else:
            print(f"❌ {field} field missing in Module")
    
    # Test 2: Check if Lesson model has Bunny fields
    print("\n2. Testing Lesson model fields...")
    lesson_fields = [field.name for field in Lesson._meta.fields]
    
    for field in bunny_fields:
        if field in lesson_fields:
            print(f"✅ {field} field exists in Lesson")
        else:
            print(f"❌ {field} field missing in Lesson")
    
    # Test 3: Test Bunny CDN client
    print("\n3. Testing Bunny CDN client...")
    try:
        client = BunnyCDNClient()
        print("✅ BunnyCDNClient initialized successfully")
        
        # Test video validation
        test_video_id = "d8b328b6-2a03-4d53-99d1-f58daed43008"
        print(f"Testing video validation for ID: {test_video_id}")
        
        video_info = client.get_video_info(test_video_id)
        if video_info:
            print(f"✅ Video info retrieved: {video_info.get('title', 'No title')}")
        else:
            print("❌ Failed to retrieve video info")
            
    except Exception as e:
        print(f"❌ BunnyCDNClient error: {str(e)}")
    
    # Test 4: Test Module Bunny methods
    print("\n4. Testing Module Bunny methods...")
    try:
        # Get or create a test module
        module, created = Module.objects.get_or_create(
            name="Test Module for Bunny Integration",
            defaults={
                'description': 'This is a test module to verify Bunny CDN integration',
                'course_id': 1,  # Assuming course with ID 1 exists
                'order': 1,
                'is_active': True,
            }
        )
        
        if created:
            print(f"✅ Created test module: {module.name}")
        else:
            print(f"✅ Using existing test module: {module.name}")
        
        # Test Bunny video methods
        print(f"Has Bunny video: {module.has_bunny_video}")
        print(f"Video source: {module.video_source}")
        print(f"Video URL: {module.get_video_url()}")
        
        # Test updating with Bunny video
        test_video_id = "d8b328b6-2a03-4d53-99d1-f58daed43008"
        print(f"\nTesting update with Bunny video ID: {test_video_id}")
        
        success = update_module_bunny_video(module, test_video_id)
        if success:
            print("✅ Module updated with Bunny video successfully")
            print(f"Bunny video ID: {module.bunny_video_id}")
            print(f"Bunny video URL: {module.bunny_video_url}")
            print(f"Has Bunny video: {module.has_bunny_video}")
            print(f"Video source: {module.video_source}")
            print(f"Video URL: {module.get_video_url()}")
        else:
            print("❌ Failed to update module with Bunny video")
            
    except Exception as e:
        print(f"❌ Module Bunny methods error: {str(e)}")
    
    # Test 5: Test Lesson Bunny methods
    print("\n5. Testing Lesson Bunny methods...")
    try:
        # Get or create a test lesson
        lesson, created = Lesson.objects.get_or_create(
            title="Test Lesson for Bunny Integration",
            defaults={
                'description': 'This is a test lesson to verify Bunny CDN integration',
                'module': module,
                'lesson_type': 'video',
                'order': 1,
                'is_active': True,
            }
        )
        
        if created:
            print(f"✅ Created test lesson: {lesson.title}")
        else:
            print(f"✅ Using existing test lesson: {lesson.title}")
        
        # Test Bunny video methods
        print(f"Has Bunny video: {lesson.has_bunny_video}")
        print(f"Video source: {lesson.video_source}")
        print(f"Video URL: {lesson.get_video_url()}")
        
        # Test updating with Bunny video
        test_video_id = "d8b328b6-2a03-4d53-99d1-f58daed43008"
        print(f"\nTesting update with Bunny video ID: {test_video_id}")
        
        success = update_lesson_bunny_video(lesson, test_video_id)
        if success:
            print("✅ Lesson updated with Bunny video successfully")
            print(f"Bunny video ID: {lesson.bunny_video_id}")
            print(f"Bunny video URL: {lesson.bunny_video_url}")
            print(f"Has Bunny video: {lesson.has_bunny_video}")
            print(f"Video source: {lesson.video_source}")
            print(f"Video URL: {lesson.get_video_url()}")
        else:
            print("❌ Failed to update lesson with Bunny video")
            
    except Exception as e:
        print(f"❌ Lesson Bunny methods error: {str(e)}")
    
    # Test 6: Test API endpoints (if server is running)
    print("\n6. Testing API endpoints...")
    try:
        import requests
        
        # Test module video validation endpoint
        response = requests.post(
            'http://localhost:8000/api/content/bunny/validate/',
            json={'video_id': test_video_id},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Video validation API working: {data.get('valid', False)}")
        else:
            print(f"❌ Video validation API error: {response.status_code}")
            
        # Test module update endpoint
        response = requests.post(
            f'http://localhost:8000/api/content/modules/{module.id}/bunny-video/',
            json={'video_id': test_video_id},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Module update API working: {data.get('success', False)}")
        else:
            print(f"❌ Module update API error: {response.status_code}")
            
        # Test lesson update endpoint
        response = requests.post(
            f'http://localhost:8000/api/content/lessons/{lesson.id}/bunny-video/',
            json={'video_id': test_video_id},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Lesson update API working: {data.get('success', False)}")
        else:
            print(f"❌ Lesson update API error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("⚠️  API server not running - skipping API tests")
    except Exception as e:
        print(f"❌ API test error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("🎬 Units and Lessons Bunny CDN Integration Test Complete!")

if __name__ == '__main__':
    test_units_lessons_bunny_integration()
