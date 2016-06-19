import sun.audio.AudioPlayer;
import sun.audio.AudioStream;
import java.io.IOException;

/**
 * Created by JBarna on 6/16/2016.
 */
public class AudioAlert {

    private static AudioAlert INSTANCE;

    public static AudioAlert getInstance(){
        if (INSTANCE == null)
            INSTANCE = new AudioAlert();

        return INSTANCE;

    }

    private AudioStream clip;

    private AudioAlert(){
    }

    // I wanted to load the AudioStream only once, but because it's a stream
    // it gets used up each time so we just load it each time we want to play
    public void playAlert(){

        try {

            clip = new AudioStream(getClass().getResourceAsStream("Alert.wav"));
            AudioPlayer.player.start( clip );

        } catch (IOException e){
            System.err.println("Could not open audio stream");
        }


    }

}
