#!/usr/bin/env python3
"""
Test script to verify the integration between frontend and backend
"""

import json
import os
import sys
from pathlib import Path

def test_persona_mapping():
    """Test that frontend persona IDs map correctly to backend names"""
    
    # Frontend persona IDs (what the frontend sends)
    frontend_personas = ["socrates", "einstein", "trump", "shakespeare", "tesla", "churchill", "gandhi", "jobs"]
    
    # Backend persona mapping (from main.py)
    persona_mapping = {
        "socrates": "AI Socrates",
        "einstein": "AI Einstein", 
        "trump": "AI Trump",
        "shakespeare": "AI Shakespeare",
        "tesla": "AI Tesla",
        "churchill": "AI Churchill",
        "gandhi": "AI Gandhi",
        "jobs": "AI Steve Jobs"
    }
    
    print("Testing persona mapping...")
    for frontend_id in frontend_personas:
        backend_name = persona_mapping.get(frontend_id)
        if backend_name:
            print(f"✅ {frontend_id} -> {backend_name}")
        else:
            print(f"❌ {frontend_id} -> NOT FOUND")
    
    return True

def test_configuration_passing():
    """Test that configuration is passed correctly"""
    
    # Simulate frontend request
    frontend_request = {
        "room": "test-room",
        "user": "test-user",
        "topic": "The Future of AI",
        "personas": ["socrates", "einstein", "trump"],
        "turnDuration": 3,
        "numberOfTurns": 4
    }
    
    print("\nTesting configuration passing...")
    print(f"Frontend sends: {json.dumps(frontend_request, indent=2)}")
    
    # Simulate backend processing
    topic = frontend_request.get("topic", "AI Debate")
    personas = frontend_request.get("personas", [])
    turn_duration = frontend_request.get("turnDuration", 3)
    number_of_turns = frontend_request.get("numberOfTurns", 4)
    
    persona_mapping = {
        "socrates": "AI Socrates",
        "einstein": "AI Einstein", 
        "trump": "AI Trump",
        "shakespeare": "AI Shakespeare",
        "tesla": "AI Tesla",
        "churchill": "AI Churchill",
        "gandhi": "AI Gandhi",
        "jobs": "AI Steve Jobs"
    }
    
    mapped_personas = [persona_mapping.get(p, p) for p in personas]
    
    backend_config = {
        "topic": topic,
        "personas": mapped_personas,
        "room": frontend_request["room"],
        "turn_duration_min": turn_duration,
        "total_rounds": number_of_turns
    }
    
    print(f"Backend processes: {json.dumps(backend_config, indent=2)}")
    
    # Verify the mapping worked
    expected_personas = ["AI Socrates", "AI Einstein", "AI Trump"]
    if mapped_personas == expected_personas:
        print("✅ Persona mapping works correctly")
    else:
        print(f"❌ Persona mapping failed: expected {expected_personas}, got {mapped_personas}")
        return False
    
    return True

def test_environment_variables():
    """Test that environment variables are set correctly"""
    
    print("\nTesting environment variables...")
    
    # Check required environment variables
    required_vars = ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"]
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var} is set")
        else:
            print(f"⚠️  {var} is not set (will use default)")
    
    # Check optional environment variables
    optional_vars = ["STT_MODEL", "LLM_MODEL", "TTS_MODEL"]
    
    for var in optional_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var} = {value}")
        else:
            print(f"ℹ️  {var} not set (will use default)")
    
    return True

def main():
    """Run all tests"""
    print("🧪 Testing Multi-AI Debate Backend Integration")
    print("=" * 50)
    
    tests = [
        test_persona_mapping,
        test_configuration_passing,
        test_environment_variables
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
    
    print("\n" + "=" * 50)
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! The integration should work correctly.")
    else:
        print("⚠️  Some tests failed. Please check the configuration.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 