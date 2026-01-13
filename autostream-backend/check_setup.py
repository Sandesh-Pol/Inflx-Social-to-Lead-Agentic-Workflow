"""
Quick Start Script
Helps users set up their environment
"""
import os
import sys

def check_environment():
    """Check if environment is properly configured"""
    print("=" * 70)
    print("AutoStream AI Assistant - Environment Check")
    print("=" * 70)
    
    issues = []
    
    # Check .env file
    if not os.path.exists(".env"):
        issues.append("❌ .env file not found")
        print("❌ .env file not found")
        print("   → Copy .env.example to .env")
    else:
        print("✅ .env file exists")
        
        # Check API key
        with open(".env", "r") as f:
            content = f.read()
            if "GEMINI_API_KEY=" not in content or "GEMINI_API_KEY=\n" in content or "GEMINI_API_KEY=" == content.strip():
                issues.append("❌ GEMINI_API_KEY not set in .env")
                print("❌ GEMINI_API_KEY is empty")
                print("   → Get your key from: https://makersuite.google.com/app/apikey")
            else:
                print("✅ GEMINI_API_KEY is set")
    
    # Check knowledge base
    kb_path = "app/data/knowledge.md"
    if os.path.exists(kb_path):
        print("✅ Knowledge base found")
    else:
        issues.append("❌ Knowledge base not found")
        print(f"❌ {kb_path} not found")
    
    # Check required packages
    try:
        import fastapi
        import langchain
        import langgraph
        import google.generativeai
        print("✅ All required packages installed")
    except ImportError as e:
        issues.append(f"❌ Missing package: {e.name}")
        print(f"❌ Missing package: {e.name}")
        print("   → Run: pip install -r ../requirements.txt")
    
    print("=" * 70)
    
    if issues:
        print(f"\n⚠️  Found {len(issues)} issue(s). Please fix them before running.\n")
        return False
    else:
        print("\n✅ Environment is ready! You can start the server.\n")
        print("To start the server:")
        print("  • PowerShell: .\\run_server.ps1")
        print("  • Python: python -m app.main")
        print("  • Uvicorn: uvicorn app.main:app --reload\n")
        return True

if __name__ == "__main__":
    success = check_environment()
    sys.exit(0 if success else 1)
