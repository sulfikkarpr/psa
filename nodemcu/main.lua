local http = require("socket.http")
local cjson = require("cjson")
local wifi = require("wifi")
local espeak = require("espeak") -- If using espeak for text-to-speech

-- WiFi credentials 
wifi.setmode(wifi.STATION)
wifi.sta.config("your_wifi_ssid", "your_wifi_password")
wifi.sta.connect()
while wifi.sta.status() ~= wifi.STA_GOT_IP do 
  print("Connecting to WiFi...")
  tmr.delay(500)
end
print("Connected! IP address: ", wifi.sta.getip())

-- Server address 
local server_ip = "192.168.1.100" -- Replace with your server's IP address
local server_port = 3000
local tasks_endpoint = string.format("http://%s:%d/tasks", server_ip, server_port)

-- Function to fetch tasks 
local function fetch_tasks()
  http.get(tasks_endpoint, nil, 
    function(code, data)
      if (code == 200) then
        local tasks = cjson.decode(data) 
        for i = 1, #tasks do
          local task = tasks[i]
          print("Task:", task.description)  
          -- Announce with espeak (if available):
          -- espeak.synth(task.description) 
        end
      else
        print("Error fetching tasks:", code)
      end
    end
  )
end

-- Fetch tasks every 10 seconds (adjust as needed)
tmr.alarm(0, 10000, 1, fetch_tasks)