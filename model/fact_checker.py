# model/fact_checker.py
import requests
import numpy as np
from sentence_transformers import SentenceTransformer, util

class FactChecker:
    def __init__(self):
        self.GOOGLE_API_KEY = "AIzaSyDNeMBludw0zfbeRf2yZ1Adcy1bgwIyYYc"
        self.FACTCHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def fetch_fact_check(self, query):
        """Fetches fact-check results from Google Fact Check API (English only)"""
        params = {"query": query, "key": self.GOOGLE_API_KEY, "languageCode": "en"}
        response = requests.get(self.FACTCHECK_URL, params=params)

        if response.status_code == 200:
            data = response.json()
            if "claims" in data:
                return [
                    {
                        "text": claim["text"],
                        "verdict": claim["claimReview"][0]["textualRating"],
                        "source": claim["claimReview"][0]["url"]
                    }
                    for claim in data["claims"]
                ]
        return []

    def process_claim(self, claim):
        fact_results = self.fetch_fact_check(claim)

        if not fact_results:
            return {
                "alert": "No Data",
                "confidence": 0,
                "summary": "No relevant fact-checks found.",
                "source": None
            }

        claim_embedding = self.model.encode(claim, convert_to_tensor=True)
        scores = []

        for fact in fact_results:
            fact_text = fact["text"]
            fact_embedding = self.model.encode(fact_text, convert_to_tensor=True)
            similarity = util.pytorch_cos_sim(claim_embedding, fact_embedding).item()
            scores.append((fact, similarity))

        scores.sort(key=lambda x: x[1], reverse=True)

        top_scores = [score[1] for score in scores[:3]]
        confidence = int(np.mean(top_scores) * 100) if top_scores else 0

        alert = "Misleading"
        if confidence > 85:
            alert = "True"
        elif confidence > 70:
            alert = "Partially True"

        return {
            "alert": alert,
            "confidence": confidence,
            "summary": scores[0][0]["text"] if scores else "No summary available.",
            "source": scores[0][0]["source"] if scores else None
        }