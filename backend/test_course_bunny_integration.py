#!/usr/bin/env python
"""
Test script for Course Bunny CDN integration
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from courses.models import Course
from content.bunny_utils import update_course_bunny_promotional_video, BunnyCDNClient

def test_course_bunny_integration():
    """Test Course Bunny CDN integration"""
    print("🎬 Testing Course Bunny CDN Integration")
    print("=" * 50)
    
    # Test 1: Check if Course model has Bunny fields
    print("\n1. Testing Course model fields...")
    course_fields = [field.name for field in Course._meta.fields]
    bunny_fields = ['bunny_promotional_video_id', 'bunny_promotional_video_url']
    
    for field in bunny_fields:
        if field in course_fields:
            print(f"✅ {field} field exists")
        else:
            print(f"❌ {field} field missing")
    
    # Test 2: Test Bunny CDN client
    print("\n2. Testing Bunny CDN client...")
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
    
    # Test 3: Test Course Bunny methods
    print("\n3. Testing Course Bunny methods...")
    try:
        # Get or create a test course
        course, created = Course.objects.get_or_create(
            title="Test Course for Bunny Integration",
            defaults={
                'subtitle': 'Test course for Bunny CDN integration',
                'description': 'This is a test course to verify Bunny CDN integration',
                'level': 'beginner',
                'language': 'ar',
                'status': 'published',
                'is_free': True,
            }
        )
        
        if created:
            print(f"✅ Created test course: {course.title}")
        else:
            print(f"✅ Using existing test course: {course.title}")
        
        # Test Bunny video methods
        print(f"Has Bunny promotional video: {course.has_bunny_promotional_video}")
        print(f"Promotional video source: {course.promotional_video_source}")
        print(f"Promotional video URL: {course.get_promotional_video_url()}")
        
        # Test updating with Bunny video
        test_video_id = "d8b328b6-2a03-4d53-99d1-f58daed43008"
        print(f"\nTesting update with Bunny video ID: {test_video_id}")
        
        success = update_course_bunny_promotional_video(course, test_video_id)
        if success:
            print("✅ Course updated with Bunny promotional video successfully")
            print(f"Bunny video ID: {course.bunny_promotional_video_id}")
            print(f"Bunny video URL: {course.bunny_promotional_video_url}")
            print(f"Has Bunny promotional video: {course.has_bunny_promotional_video}")
            print(f"Promotional video source: {course.promotional_video_source}")
            print(f"Promotional video URL: {course.get_promotional_video_url()}")
        else:
            print("❌ Failed to update course with Bunny promotional video")
            
    except Exception as e:
        print(f"❌ Course Bunny methods error: {str(e)}")
    
    # Test 4: Test API endpoints (if server is running)
    print("\n4. Testing API endpoints...")
    try:
        import requests
        
        # Test video validation endpoint
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
            
    except requests.exceptions.ConnectionError:
        print("⚠️  API server not running - skipping API tests")
    except Exception as e:
        print(f"❌ API test error: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎬 Course Bunny CDN Integration Test Complete!")

if __name__ == '__main__':
    test_course_bunny_integration()
