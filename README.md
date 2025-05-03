# Embedding React in .NET MVC

Simplest possible example of Embedding React in .NET MVC with Hot Reload & Debugging

## 1. Create the .NET MVC Application

### Create a new MVC project

``
dotnet new mvc -n MvcReactSimple
cd MvcReactSimple
``

## 2. Create React App with Vite
### Create React app using Vite in a ClientApp subdirectory

``
npm create vite@latest ClientApp -- --template react
cd ClientApp
npm install
npm install react-router-dom
cd ..
``

## 3. Configure Vite
``import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  return {
    plugins: [react()],
    base: isProduction ? '/react-app/' : '/',
    server: {
      port: 5173,
      strictPort: true,
      hmr: {
        clientPort: 5173,
      }
    },
    build: {
      outDir: '../wwwroot/react-app',
      emptyOutDir: true,
      sourcemap: true,
    }
  }
})``

## 4. Configure React App with Routing
main.jsx
``import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import './App.css'``


``function App() {
  // Determine if we're in development or production to set correct base URL
  const baseUrl = import.meta.env.PROD ? '/react-app' : '';
  return (
    <BrowserRouter basename={baseUrl}>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App``

## 5. Create React Components

``import React, { useState } from 'react'
function Home() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the home page of our React app within MVC.</p>
      <button onClick={() => setCount(count + 1)}>
        Count is: {count}
      </button>
    </div>
  )
}
export default Home
import React from 'react'
function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page of our React app.</p>
    </div>
  )
}
export default About``

## 6. Create MVC Controller

``using Microsoft.AspNetCore.Mvc;
namespace MvcReactSimple.Controllers
{
    public class ReactController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}``

## 7. Create MVC View

``@{
    ViewData["Title"] = "React App";
    Layout = "_Layout";
}
<div id="root"></div>
@section Scripts {
    @if (Context.Request.Host.Value.Contains("localhost") && 
         Context.Request.Host.Port != 5173 && 
         Context.Request.Host.Port != 5000)
    {
        <!-- Development: Load from Vite dev server -->
        <script type="module" src="http://localhost:5173/@Url.Content("~/main.jsx")"></script>
    }
    else
    {
        <!-- Production: Load built assets -->
        <script type="module" src="@Url.Content("~/react-app/assets/index.js")"></script>
    }
}``

## 8. Configure ASP.NET Core App

``using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
var builder = WebApplication.CreateBuilder(args);
// Add services to the container
builder.Services.AddControllersWithViews();
var app = builder.Build();
// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
// Special handling for client-side routing in React when in production
// This ensures that routes like /about are handled by React router
app.MapWhen(
    context => !context.Request.Path.StartsWithSegments("/api") &&
               context.Request.Path.StartsWithSegments("/react-app"),
    appBuilder =>
    {
        appBuilder.UseStaticFiles();
        appBuilder.Run(async context =>
        {
            context.Response.ContentType = "text/html";
            await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "react-app", "index.html"));
        });
    }
);
app.Run();``

## 9. Set Up VS Code Debugging

Create a .vscode/launch.json file:

``{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/bin/Debug/net7.0/MvcReactSimple.dll",
      "args": [],
      "cwd": "${workspaceFolder}",
      "stopAtEntry": false,
      "serverReadyAction": {
        "action": "openExternally",
        "pattern": "\\bNow listening on:\\s+(https?://\\S+)"
      },
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "sourceFileMap": {
        "/Views": "${workspaceFolder}/Views"
      }
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "React: Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/ClientApp",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/src/*"
      }
    }
  ],
  "compounds": [
    {
      "name": "Full Stack: .NET + React",
      "configurations": [".NET Core Launch (web)", "React: Launch Chrome"]
    }
  ]
}``

## 10. Development Workflow

Start the React dev server (with hot reload):
``cd ClientApp
npm run dev``
Start the .NET application (in another terminal):
``dotnet run``
Access the application:
MVC app: http://localhost:5000
React dev server: http://localhost:5173
Debug React:
Open VS Code
Set breakpoints in React components
Press F5 and select "React: Launch Chrome" configuration
11. Production Build
# Build React app
``cd ClientApp``
npm run build
# Build and run .NET app
``cd ..
dotnet publish
dotnet run --environment Production``

This setup gives you:
Clear separation between React and MVC
Hot module reload during development
Integrated debugging in VS Code
React routing that works in both dev and production
Optimized production builds
