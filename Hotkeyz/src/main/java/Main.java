import com.tulskiy.keymaster.common.HotKey;
import com.tulskiy.keymaster.common.HotKeyListener;
import com.tulskiy.keymaster.common.Provider;

import javax.swing.*;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.util.Scanner;

/**
 * Created by JBarna on 6/14/2016.
 */
public class Main {


    public static void main( String [] args ){

        TrayIconManager.getInstance();
        Connection.getInstance().startConnection();

    }
}
