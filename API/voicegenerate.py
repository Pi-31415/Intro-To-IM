from elevenlabs import generate, play, save
from elevenlabs import set_api_key
import string
from tqdm import tqdm
import re

# Set API key for ElevenLabs
set_api_key("63a48f1ddf0b6704ea1b0f098582e56f")  # Replace with your actual API key


voice = "Charlotte"  # Define the voice to be used

def generate_voice(sentence):
    try:
        if not isinstance(sentence, str):
            raise ValueError("Sentence must be a string")

        # Generate the audio from the sentence
        audio = generate(text=sentence, voice=voice)

        # Clean and shorten the sentence to create a valid filename
        filename_start = "_".join(re.sub(r'[^\w\s]', '', sentence).split()[:5])
        audio_file_path = f"./{filename_start}.mp3"  # Replace with your desired path

        # Save the audio
        save(audio, audio_file_path)
        return audio_file_path  # Return the path of the saved audio file
    except Exception as e:
        print(f"Error generating voice: {e}")
        return None

def process_sentences(sentences):
    for sentence in tqdm(sentences, desc="Processing sentences"):
        audio_file = generate_voice(sentence)
        if audio_file:
            print(f"Audio file saved at: {audio_file}")

# Array of sentences
# sentences = [
# "Name's Pi. Some call me a tech mercenary...others...the devil's engineer. Some live by the code...some die by it. Me? I rewrite it. In this city, every shadow's for sale, and every dream's got a price tag. This story...my story.It's about the dazzle of lights and the shadows they cast.",
# "Every corner of this city screams opportunity... for those who know where to look.",
# "You’ve got Pi...Make it quick.",
# "Talk is cheap...What’s the job?",
# "You’re asking for miracles.",
# "Alright, you have my attention. But let's talk numbers. You want top-tier tech? That comes with a top-tier price.",
# "Five hundred K? For a brain-machine interface breakthrough? We're talking about cutting-edge brain tech here. I won't start the engines for less than a million.",
# "Now you’re just insulting both of us. Let’s cut to the chase. I want 1.5 million, plus expenses. And I get full autonomy on the project. No oversight.",
# "No deal then...A cave and a pile of scraps was enough to make history. I'm making the future!",
# "So it's a dance you want.",
# "Come on, you rust buckets! Show me what you've got!",
# "Not today...not ever.",
# "This city... is mine."

# ]
            
sentences = [
"Pi...I've watched you...Your reputation precedes you...I require someone with your...exceptional talents.",
"A new frontier, Pi. Brain-controlled robotics. I need you to assess the viability using current tech. And if possible, execute it.",
"Understandable. We are prepared to offer you 500,000 credits, upon successful completion.",
"600,000. And that’s stretching our generosity.",
"1.5 is... out of the question. 800,000. Final offer. And we require regular updates.",
"This is my final offer!",
"You don't want to cross me, Pi. If we cannot have you, nobody will."
]

# Process the sentences
process_sentences(sentences)