using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

class Program {
    static void Main(string[] args) {
        string appDir = @"C:\Users\TEMP.LAPTOP-NKQ8BATR.001\OneDrive\Escritorio\Aluna IA";
        
        try {
            // Start the dev server silently
            ProcessStartInfo npmInfo = new ProcessStartInfo("cmd.exe", "/c npm run dev");
            npmInfo.WorkingDirectory = appDir;
            npmInfo.WindowStyle = ProcessWindowStyle.Hidden;
            npmInfo.CreateNoWindow = true;
            Process.Start(npmInfo);
            
            // Wait for server to start
            Thread.Sleep(4000);
            
            // Open browser
            Process.Start(new ProcessStartInfo("http://localhost:5173") { UseShellExecute = true });
        } catch (Exception ex) {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
