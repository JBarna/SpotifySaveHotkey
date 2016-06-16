

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class TrayIconManager {

    private static TrayIconManager INSTANCE;

    private SystemTray systemTray;
    private boolean isSupported;
    private TrayIcon trayIcon;
    private CheckboxMenuItem startupItem;
    private Image orangeEnvelope;

    public static TrayIconManager getInstance(){
        if (INSTANCE == null){
            INSTANCE = new TrayIconManager();
        }

        return INSTANCE;
    }

    private TrayIconManager() {

        isSupported = SystemTray.isSupported();
        if (isSupported) {

            systemTray = SystemTray.getSystemTray();
            orangeEnvelope = new ImageIcon(getClass().getClassLoader().getResource("CheckMark.png")).getImage();

            trayIcon = new TrayIcon(orangeEnvelope);
            trayIcon.setImageAutoSize(true);

            trayIcon.setPopupMenu( createRightPopupMenu() );

            try {
                systemTray.add(trayIcon);
            } catch (AWTException e) {
                isSupported = false;
            }
        }
    }

    private PopupMenu createRightPopupMenu(){

        PopupMenu popMen = new PopupMenu();

        startupItem = new CheckboxMenuItem("Run on startup");
        startupItem.setEnabled(false);
        startupItem.addItemListener(new ItemListener() {
            @Override
            public void itemStateChanged(ItemEvent e) {
                int id = e.getStateChange();
                Connection.getInstance().omgStartup( id == ItemEvent.SELECTED );
            }
        });

        MenuItem changeHotkey = new MenuItem("Change hotkey");
        changeHotkey.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Connection.getInstance().omgTheyWantToChangeTheKey();
            }
        });

        MenuItem aboutItem = new MenuItem("About");
        aboutItem.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Connection.getInstance().omgTheyWantToKnowAboutShit();
            }
        });

        MenuItem exit = new MenuItem("Exit");
        exit.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Connection.getInstance().omgEXIT();
            }
        });

        popMen.add( changeHotkey );
        popMen.add(startupItem);
        popMen.addSeparator();
        popMen.add(aboutItem);
        popMen.add(exit);

        return popMen;
    }

    public void setTitleFromKeystroke( String keystroke ){
        trayIcon.setToolTip( "Spotify Save Song\nHotkey: " + keystroke );
    }

    public void setStartupState(boolean value){

        if (!startupItem.isEnabled()){
            startupItem.setEnabled(true);
        }

        startupItem.setState(value);

    }
}
