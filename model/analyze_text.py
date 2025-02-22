import sys
import json
import random

def analyze_text(sentence):
    # This is a simplified analysis. In a real-world scenario, 
    # you'd want to use more sophisticated NLP techniques.
    
    # Simulate analysis
    word_count = len(sentence.split())
    is_misleading = random.choice([True, False])
    confidence = random.uniform(0.5, 1.0)
    
    # Generate a simple summary
    summary = f"This sentence contains {word_count} words."
    
    # Simulate a source
    source = "AI Analysis"
    
    return {
        "alert": "Misleading" if is_misleading else "Not Misleading",
        "confidence": round(confidence, 2),
        "summary": summary,
        "source": source
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
    else:
        sentence = sys.argv[1]
        result = analyze_text(sentence)
        print(json.dumps(result))
