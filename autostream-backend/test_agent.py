"""
Test Script for AutoStream AI Assistant
Run this to verify the backend is working correctly
"""
import asyncio
import uuid
from app.api import chat, ChatRequest

async def test_conversation():
    """Test a complete conversation flow"""
    
    print("=" * 70)
    print("AutoStream AI Assistant - Test Conversation")
    print("=" * 70)
    
    session_id = str(uuid.uuid4())
    print(f"Session ID: {session_id}\n")
    
    # Test messages
    test_messages = [
        "Hi there!",
        "What pricing plans do you offer?",
        "I'm interested in the Pro plan. My name is Sarah Chen.",
        "My email is sarah.chen@example.com and I create content on YouTube",
        "My channel is youtube.com/@SarahTech"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n{'='*70}")
        print(f"Turn {i}")
        print(f"{'='*70}")
        print(f"👤 User: {message}")
        
        try:
            request = ChatRequest(session_id=session_id, message=message)
            response = await chat(request)
            
            print(f"🤖 Assistant: {response.reply}")
            print(f"\n📊 Intent: {response.intent}")
            print(f"📋 State: {response.state}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            break
    
    print(f"\n{'='*70}")
    print("Test Complete!")
    print(f"{'='*70}")

if __name__ == "__main__":
    print("\n⚠️  Make sure to:")
    print("1. Set GEMINI_API_KEY in .env file")
    print("2. Install all requirements: pip install -r ../requirements.txt\n")
    
    input("Press Enter to start test...")
    
    asyncio.run(test_conversation())
