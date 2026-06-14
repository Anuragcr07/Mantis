from services.chroma_service import index_chunks

def seed_test_data():
    chunks = [
        {
            "text": "If device does not turn on, hold power button for 10 seconds.",
            "metadata": {"page": 1, "source_type": "manual", "source": "user_guide.pdf"}
        },
        {
            "text": "Battery LED: Red = low battery, Yellow = charging, Green = fully charged.",
            "metadata": {"page": 2, "source_type": "manual", "source": "user_guide.pdf"}
        },
        {
            "text": "Error code E001 means overheating. Turn off and let cool for 30 minutes.",
            "metadata": {"page": 5, "source_type": "manual", "source": "user_guide.pdf"}
        }
    ]
    result = index_chunks("prod001", chunks)
    print(f"Seeded: {result}")

if __name__ == "__main__":
    seed_test_data()
