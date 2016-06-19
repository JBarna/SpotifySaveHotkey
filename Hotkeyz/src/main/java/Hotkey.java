import org.jnativehook.GlobalScreen;
import org.jnativehook.NativeHookException;
import org.jnativehook.keyboard.NativeKeyEvent;
import org.jnativehook.keyboard.NativeKeyListener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by JBarna on 6/15/2016.
 */
public class Hotkey implements NativeKeyListener{

    // singletons stuff
    private static Hotkey INSTANCE;
    public static Hotkey getInstance(){

        if (INSTANCE == null)
            INSTANCE = new Hotkey();

        return INSTANCE;
    }

    // actual class shit

    private int keyID = -1;
    private ArrayList<Integer> modIDs;
    private Hotkey(){

        try {
            GlobalScreen.registerNativeHook();
        }
        catch (NativeHookException ex) {
            System.err.println("There was a problem registering the native hook.");
            System.err.println(ex.getMessage());

            System.exit(1);
        }

        // Get the logger for "org.jnativehook" and set the level to warning.
        Logger logger = Logger.getLogger(GlobalScreen.class.getPackage().getName());
        logger.setLevel(Level.WARNING);

        // Don't forget to disable the parent handlers.
        logger.setUseParentHandlers(false);

    }

    // alt shift F7
    // we need to make the modifier shift+alt
    // and then we need to find the value for F7
    public void setKeyStroke( String keystroke ) {

        keystroke = keystroke.toLowerCase();

        ArrayList<String> parts = new ArrayList<String>(Arrays.asList( keystroke.split("\\s+")));

        StringBuilder mods = new StringBuilder();

        if (parts.contains("shift")) {
            mods.append("shift+");
            parts.remove("shift");
        }

        if (parts.contains("ctrl")) {
            mods.append("ctrl+");
            parts.remove("ctrl");
        }

        if (parts.contains("alt")) {
            mods.append("alt");
            parts.remove("alt");
        }

        String realMods = mods.toString();

        // remove the + if it's there
        if (realMods.endsWith("+"))
            realMods = realMods.substring(0, realMods.length() -1);

        String key = parts.remove(0);
        if (!parts.isEmpty())
            key += " " + parts.remove(0);

        // find the ID code of our modifier
        modIDs = new ArrayList<Integer>();

        for (int i = 0; i < 1000; i++){
            if (NativeKeyEvent.getModifiersText(i).equalsIgnoreCase(realMods))
                modIDs.add(i);
        }

        // find the ID code of the key
        for (int i = 0; i < 120; i++){
            if (NativeKeyEvent.getKeyText(i).equalsIgnoreCase(key)) {
                keyID = i;
                break;
            }
        }

        if (keyID == -1 || modIDs.isEmpty())
            TrayIconManager.getInstance().setTitleFromKeystroke( "OMFG ERROR" );
        else
            TrayIconManager.getInstance().setTitleFromKeystroke( realMods + " " + key );

    }

    public void startListening(){

        GlobalScreen.addNativeKeyListener(this);

    }

    public void nativeKeyPressed(NativeKeyEvent e) {

        if (e.getKeyCode() == keyID && modIDs.contains(e.getModifiers()) )
            Connection.getInstance().omgTheyHitTheKey();
    }

    public void nativeKeyReleased(NativeKeyEvent nativeKeyEvent) {

    }

    public void nativeKeyTyped(NativeKeyEvent nativeKeyEvent) {

    }
}
