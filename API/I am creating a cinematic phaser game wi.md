I am creating a cinematic phaser game with voice acting and I have the following voice files, voice scripts (2 characters Pi and Client)
, and a Phaser Cinematics Class to auto handle the dialogues , we currently have to pass in the array of audiofiles anad array of subtitles.

The base url for locaiton of these audio files are at 
https://intro-to-im.vercel.app/API/assets/audio/

I want to do 3 things :

1) According to the script of the story, I want a Javascript Object JSON which looks like this format (arranged in the order of the script)
{id of audiofile, the key of audiofile, filename of audiofile, speakername, subtitle string,actions to trigger - which is empty by default  }

2) Use that JSON to load all audiofiles through a loop in phaser, like in example script below 
 
3) I want the Cinematic class to load that JSON instead of separate array for audiofiles and subtitles, and operate

------------------------------------------


Phaser Cinemataics Class : 
class Cinematic {
  constructor(scene, audioFiles, subtitles) {
    this.scene = scene;
    this.audioFiles = audioFiles;
    this.subtitles = subtitles;
    this.currentCinematicIndex = 0;
    this.subtitleText = null;
    this.isCinematicPlaying = false;
     this.collidedObject = null; // Add a property to store the collided object
  }

  create() {
    // Create the text object for subtitles, but set it to invisible
    this.subtitleText = this.scene.add
      .text(this.scene.scale.width / 2, this.scene.scale.height * 0.8, "", {
        font: "30px Arial",
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(10000)
      .setVisible(false);

    // Setup collision events
    this.setupCollisionEvents();
  }

  update() {
    if (this.subtitleText.visible) {
      // Position the text above the player
      const player = this.scene.player.sprite;
      this.subtitleText.setPosition(
        player.x,
        player.y+200
      ); // Adjust the Y offset as needed
    }
  }

  setupCollisionEvents() {
    this.scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      if (this.isCinematicPlaying) {
        return;
      }

      // Determine the collided object (which is not the player)
      let other = bodyA.gameObject === this.scene.player.sprite ? bodyB.gameObject : bodyA.gameObject;
      if (other) {
        this.collidedObject = other; // Store the reference to the collided object
        if (!other.frame || other.frame.texture.key !== 'wall') {
        this.playCinematic();
      }
      }
    });
  }

  playCinematic() {
 
    if (this.currentCinematicIndex >= this.audioFiles.length) {
      return;
    }
    this.isCinematicPlaying = true;

    // Play the audio
    let audio = this.scene.sound.add(
      this.audioFiles[this.currentCinematicIndex],
      { volume: 0.25, loop: false }
    );
    audio.play();

    // Display the subtitle
    this.subtitleText.setText(this.subtitles[this.currentCinematicIndex]);
    this.subtitleText.setVisible(true);

    // Setup an event to hide the subtitle when the audio finishes
    audio.on("complete", () => {
      this.subtitleText.setVisible(false);
      this.isCinematicPlaying = false;

      // Increment the cinematic index
      this.currentCinematicIndex++;
      
       // Delete the other game object after audio finishes
      if (this.collidedObject && this.collidedObject.destroy) {
        this.collidedObject.destroy();
        this.collidedObject = null; // Clear the reference
      }

      // Log "Done" when all cinematics are played
      if (this.currentCinematicIndex >= this.audioFiles.length) {
        console.log("Done");
      }
    });
  }
}

-------------------
Example of audio loading in phaser :
 this.load.audio(
      "1",
      "https://intro-to-im.vercel.app/API/assets/1.mp3"
    );

Example of using Cinematics class 

 // Example initialization in create method
    this.cinematic = new Cinematic(
      this,
      ["1"],
      ["Pi Wake Up.\n This is what you have been waiting for."]
    );
    this.cinematic.create();


------------------
Audio File Names : 
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----          3/5/2024   2:44 AM          57904 15_is_out_of_the.mp3
-a----          3/5/2024   2:44 AM          30737 600000_And_thats_stretching_our.mp3
-a----          3/5/2024   1:15 AM          95712 Alright_you_have_my_attention.mp3
-a----          3/5/2024   2:44 AM          70861 A_new_frontier_Pi_Braincontrolled.mp3
-a----          3/5/2024   1:15 AM          46811 Come_on_you_rust_buckets.mp3
-a----          3/5/2024   1:15 AM          72724 Every_corner_of_this_city.mp3
-a----          3/5/2024   1:15 AM         146285 Five_hundred_K_For_a.mp3
-a----          3/5/2024   1:15 AM         328933 Names_Pi_Some_call_me.mp3
-a----          3/5/2024   1:15 AM          25077 Not_todaynot_ever.mp3
-a----          3/5/2024   1:15 AM         163422 Now_youre_just_insulting_both.mp3
-a----          3/5/2024   1:15 AM          90697 No_deal_thenA_cave_and.mp3
-a----          3/5/2024   2:44 AM          56441 PiIve_watched_youYour_reputation_precedes.mp3
-a----          3/5/2024   1:15 AM          24241 So_its_a_dance_you.mp3
-a----          3/5/2024   1:15 AM          32600 Talk_is_cheapWhats_the_job.mp3
-a----          3/5/2024   1:15 AM          24241 This_city_is_mine.mp3
-a----          3/5/2024   2:44 AM          12973 This_is_my_final_offer.mp3
-a----          3/5/2024   2:44 AM          43902 Understandable_We_are_prepared_to.mp3
-a----          3/5/2024   1:15 AM          23823 Youre_asking_for_miracles.mp3
-a----          3/5/2024   1:15 AM          28003 Youve_got_PiMake_it_quick.mp3
-a----          3/5/2024   2:44 AM          30528 You_dont_want_to_cross.mp3



FULL Script and actions to trigger
-------------------------------------------------
Pi : "Every corner of this city screams opportunity... for those who know where to look." trigger phone call

----------------------

Pi : "You’ve got Pi...Make it quick.", stops phone call

-----

Client : "Pi...I've watched you...Your reputation precedes you...I require someone with your...exceptional talents."

---------------

Pi : "Talk is cheap...What’s the job?"

----------
Client : "A new frontier, Pi. Brain-controlled robotics. I need you to assess the viability using current tech. And if possible, execute it."

-----------------
Pi : "You’re asking for miracles. Alright, you have my attention. But let's talk numbers. You want top-tier tech? That comes with a top-tier price."

------------
Client : "Understandable. We are prepared to offer you 500,000 credits, upon successful completion."

----------------------
Pi : "Five hundred K? For a brain-machine interface breakthrough? We're talking about cutting-edge brain tech here. I won't start the engines for less than a million."
-----------------

Client : "600,000. And that’s stretching our generosity."

-----------------

Pi : "Now you’re just insulting both of us. Let’s cut to the chase. I want 1.5 million, plus expenses. And I get full autonomy on the project. No oversight."

--------------

Client : "1.5 is... out of the question. 800,000. Final offer. And we require regular updates.",


----------------

Pi : ""No deal then...A cave and a pile of scraps was enough to make history. I'm making the future!"

------------

Client : "You don't want to cross me, Pi. If we cannot have you, nobody will." , trigger Attack Sequence

--------------

Pi : "So it's a dance you want."
------------
Pi : "Come on, you rust buckets! Show me what you've got!", disable Attack sequence


------------
Pi : "Not today...not ever."

--------------
Pi : "This city... is mine.", switch to credits


