import java.util.Scanner;

/**
 * Created by JBarna on 6/15/2016.
 */
public class Connection implements Runnable{

    private static Connection INSTANCE;
    public static Connection getInstance(){

        if (INSTANCE == null)
            INSTANCE = new Connection();

        return INSTANCE;
    }

    private Thread myThread;
    private Scanner in;

    private Connection(){
        myThread = new Thread(this);
        in = new Scanner(System.in);
    }

    public void startConnection(){

        myThread.run();

    }

    public void omgTheyHitTheKey(){

        System.out.println("keypress");

    }

    public void omgTheyWantToChangeTheKey(){

        System.out.println("config");
        System.out.println("changekey");

    }

    public void omgTheyWantToKnowAboutShit() {

        System.out.println("about");

    }

    public void omgEXIT(){

        System.out.println("exit");
        System.exit(0);
    }

    public void omgStartup( boolean value){

        System.out.println("config");
        System.out.println("startup");
        System.out.println( value ? "true": "false");

    }

    public void run(){

        while (true){

            String first = in.nextLine();

            if (first.equalsIgnoreCase("hotkey")) {

                String hotkey = in.nextLine();
                Hotkey.getInstance().setKeyStroke(hotkey);
                Hotkey.getInstance().startListening();


            } else if (first.equalsIgnoreCase("play_alert")){

                AudioAlert.getInstance().playAlert();

            } else if (first.equalsIgnoreCase("config")){

                String second = in.nextLine();
                if (second.equalsIgnoreCase("startup")){

                    String val = in.nextLine();
                    boolean boolval = Boolean.parseBoolean(val);

                    TrayIconManager.getInstance().setStartupState(boolval);


                }

            }
        }
    }
}
