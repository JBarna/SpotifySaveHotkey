/**
 * Created by JBarna on 6/14/2016.
 */
public class Main{


    public static void main( String [] args ){

        TrayIconManager.getInstance();
        Connection.getInstance().startConnection();

    }
}
