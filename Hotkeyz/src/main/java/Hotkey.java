import com.tulskiy.keymaster.common.HotKey;
import com.tulskiy.keymaster.common.HotKeyListener;
import com.tulskiy.keymaster.common.Provider;

import javax.swing.*;

/**
 * Created by JBarna on 6/15/2016.
 */
public class Hotkey implements HotKeyListener, Runnable{

    // singletons stuff
    private static Hotkey INSTANCE;
    public static Hotkey getInstance(){

        if (INSTANCE == null)
            INSTANCE = new Hotkey();

        return INSTANCE;
    }

    // actual class shit
    private KeyStroke keystroke;
    private Thread myThread;

    private Hotkey(){

        myThread = new Thread(this);

    }

    public void setKeyStroke( String keystroke ) {

        KeyStroke k = KeyStroke.getKeyStroke( keystroke );
        if ( k != null ) {
            this.keystroke = k;
            TrayIconManager.getInstance().setTitleFromKeystroke( keystroke );
        } else
            TrayIconManager.getInstance().setTitleFromKeystroke( "OMFG ERROR" );

    }

    public void startListening(){

        if ( keystroke != null)
            myThread.start();

    }

    public void run(){
        Provider p = Provider.getCurrentProvider(false);
        p.register( keystroke , this);
    }

    public void onHotKey(HotKey hotKey) {

        Connection.getInstance().omgTheyHitTheKey();

    }
}
