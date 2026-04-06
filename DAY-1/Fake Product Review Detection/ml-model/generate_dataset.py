"""
Generate a synthetic dataset for fake review detection training.
This creates a balanced dataset of fake and genuine product reviews
with realistic patterns that ML models can learn from.
"""

import pandas as pd
import random
import os

# Seed for reproducibility
random.seed(42)

# ============================================================
# Genuine Review Templates - Natural, specific, varied language
# ============================================================
genuine_templates = [
    # Electronics
    "I've been using this {product} for {duration} now and it's {quality}. The {feature} works exactly as described. {recommendation}",
    "After researching several options, I chose this {product}. The {feature} is {quality} and the build quality is solid. {minor_complaint}",
    "This {product} arrived on time and was well packaged. The {feature} exceeded my expectations. {recommendation}",
    "Bought this {product} as a {purpose}. It's been {duration} and still works {quality}. The {feature} is a nice bonus.",
    "I was hesitant at first, but this {product} has proven to be {quality}. The {feature} is particularly impressive. {recommendation}",
    "My {relation} recommended this {product} and I'm glad I listened. The {feature} is {quality}. {minor_complaint}",
    "For the price, this {product} is {quality}. The {feature} works well, though {minor_complaint}. Overall satisfied.",
    "I've owned several {product}s before and this one is by far the {superlative}. The {feature} is {quality}.",
    "This {product} does exactly what it promises. The {feature} is {quality} and I appreciate the {extra_feature}.",
    "Three months in with this {product} and no complaints. The {feature} is still {quality}. Would buy again.",
    "Updated review: After {duration} of daily use, this {product} still performs {quality}. The {feature} hasn't degraded at all.",
    "I compared this {product} with competitors and the {feature} was the deciding factor. {quality} performance overall.",
    "Not perfect, but this {product} gets the job done. The {feature} is {quality}, though the {minor_issue} could be improved.",
    "Solid {product} for everyday use. The {feature} is surprisingly {quality} at this price point. {recommendation}",
    "I use this {product} for {purpose} and it handles everything I throw at it. The {feature} is {quality}.",
]

# Fill-in values for genuine reviews
products = ["laptop", "headphones", "camera", "keyboard", "monitor", "phone case", "speaker", "tablet", "mouse", "charger", "smartwatch", "router", "microphone", "webcam", "hard drive"]
durations = ["2 weeks", "a month", "3 months", "6 months", "over a year", "about 2 months", "several weeks"]
qualities = ["excellent", "great", "really good", "impressive", "solid", "decent", "above average", "better than expected", "quite good", "remarkable"]
features = ["battery life", "sound quality", "display", "build quality", "connectivity", "performance", "design", "user interface", "portability", "durability"]
recommendations = ["Highly recommend!", "Would definitely recommend to others.", "A great purchase overall.", "Worth every penny.", "Would buy again without hesitation.", "Solid recommendation from me.", ""]
minor_complaints = ["The manual could be better though.", "Wish it came in more colors.", "Setup was a bit tricky.", "The packaging could be improved.", "It's slightly heavier than expected.", "The cord could be longer.", ""]
purposes = ["gift", "work", "replacement", "school project", "home office setup", "daily commute", "travel companion"]
relations = ["friend", "coworker", "brother", "sister", "colleague", "neighbor"]
superlatives = ["best", "most reliable", "most comfortable", "most versatile", "best value"]
extra_features = ["warranty", "customer support", "free shipping", "easy setup", "compact design"]
minor_issues = ["weight", "color options", "manual", "packaging", "cable length"]

# ============================================================
# Fake Review Templates - Exaggerated, vague, repetitive
# ============================================================
fake_templates = [
    "AMAZING {product}!!! Best {product} EVER!!! You MUST buy this!!! {exclamation}",
    "This {product} is absolutely PERFECT in every way!!! Nothing could be better!!! {exclamation}",
    "WOW!!! I can't believe how INCREDIBLE this {product} is!!! {exclamation} Buy it NOW!!!",
    "5 stars!!! Best purchase of my LIFE!!! This {product} is PHENOMENAL!!! {exclamation}",
    "I bought {count} of these {product}s and they are ALL PERFECT!!! {exclamation} Best ever!!!",
    "DO NOT HESITATE!!! Buy this {product} RIGHT NOW!!! It's the BEST thing EVER!!! {exclamation}",
    "This {product} changed my life!!! I can't live without it!!! Everyone needs this!!! {exclamation}",
    "PERFECT PERFECT PERFECT!!! This {product} is everything I ever wanted and MORE!!! {exclamation}",
    "I've tried every {product} on the market and NOTHING compares!!! This is PERFECTION!!! {exclamation}",
    "Best {product} in the ENTIRE WORLD!!! My whole family bought one!!! {exclamation}",
    "Received this {product} and was BLOWN AWAY!!! Absolutely FLAWLESS!!! {exclamation} 10/10!!!",
    "This {product} is a MUST HAVE!!! Don't even think about buying anything else!!! {exclamation}",
    "If I could give this {product} 10 stars I would!!! INCREDIBLE quality!!! {exclamation}",
    "LOVE LOVE LOVE this {product}!!! My friends are SO JEALOUS!!! {exclamation}",
    "This is the ONLY {product} worth buying!!! Everything else is GARBAGE compared to this!!! {exclamation}",
    # Competitor bashing fake reviews
    "Unlike other {product}s which are TERRIBLE, this one is PERFECT!!! Don't waste money on anything else!!!",
    "I returned my old {product} the moment I got this one!!! There's NO COMPARISON!!! {exclamation}",
    # Suspiciously detailed/promotional
    "This {product} features amazing technology with premium materials and outstanding craftsmanship. Best value proposition in the market. Highly recommended for all consumers.",
    "As a verified purchaser I can confirm this {product} exceeds all expectations. Premium quality, fast shipping, excellent customer service. Five stars.",
    "Great {product}. Great quality. Great price. Great shipping. Great customer service. Great everything. Five stars. Highly recommended.",
]

exclamations = [
    "ABSOLUTELY AMAZING!!!", "INCREDIBLE!!!", "OUTSTANDING!!!", "SPECTACULAR!!!",
    "MIND-BLOWING!!!", "EXTRAORDINARY!!!", "UNBELIEVABLE!!!", "FANTASTIC!!!",
    "SUPERB!!!", "MAGNIFICENT!!!", "PHENOMENAL!!!", "BREATHTAKING!!!"
]
counts = ["5", "3", "10", "7", "multiple", "several", "a dozen"]


def generate_genuine_review():
    """Generate a single genuine review with natural language patterns."""
    template = random.choice(genuine_templates)
    review = template.format(
        product=random.choice(products),
        duration=random.choice(durations),
        quality=random.choice(qualities),
        feature=random.choice(features),
        recommendation=random.choice(recommendations),
        minor_complaint=random.choice(minor_complaints),
        purpose=random.choice(purposes),
        relation=random.choice(relations),
        superlative=random.choice(superlatives),
        extra_feature=random.choice(extra_features),
        minor_issue=random.choice(minor_issues),
    )
    return review.strip()


def generate_fake_review():
    """Generate a single fake review with exaggerated/suspicious patterns."""
    template = random.choice(fake_templates)
    review = template.format(
        product=random.choice(products),
        exclamation=random.choice(exclamations),
        count=random.choice(counts),
    )
    return review.strip()


def generate_dataset(num_samples=2000):
    """
    Generate a balanced dataset of fake and genuine reviews.
    
    Args:
        num_samples: Total number of samples (split 50/50)
    
    Returns:
        DataFrame with 'text' and 'label' columns
    """
    reviews = []
    labels = []
    
    half = num_samples // 2
    
    # Generate genuine reviews (label = 0)
    for _ in range(half):
        reviews.append(generate_genuine_review())
        labels.append(0)
    
    # Generate fake reviews (label = 1)
    for _ in range(half):
        reviews.append(generate_fake_review())
        labels.append(1)
    
    df = pd.DataFrame({"text": reviews, "label": labels})
    
    # Shuffle the dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    return df


if __name__ == "__main__":
    print("🔄 Generating synthetic review dataset...")
    
    # Generate 2000 samples
    dataset = generate_dataset(2000)
    
    # Save to CSV
    output_path = os.path.join(os.path.dirname(__file__), "data", "reviews_dataset.csv")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    dataset.to_csv(output_path, index=False)
    
    print(f"✅ Dataset generated successfully!")
    print(f"📊 Total samples: {len(dataset)}")
    print(f"   - Genuine reviews (0): {len(dataset[dataset['label'] == 0])}")
    print(f"   - Fake reviews (1): {len(dataset[dataset['label'] == 1])}")
    print(f"💾 Saved to: {output_path}")
    
    # Show sample reviews
    print("\n📝 Sample Genuine Review:")
    print(f"   {dataset[dataset['label'] == 0].iloc[0]['text'][:100]}...")
    print("\n📝 Sample Fake Review:")
    print(f"   {dataset[dataset['label'] == 1].iloc[0]['text'][:100]}...")
