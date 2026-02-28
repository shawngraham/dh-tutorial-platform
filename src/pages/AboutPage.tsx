  
export function AboutPage() {  
  return (  
    <div className="max-w-4xl mx-auto p-8 prose prose-indigo">  
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">About DHPrimer: Tutorial Lab</h1>  
  
      <section>  
        <h2 className="text-lg font-semibold text-gray-800 mb-4">What this site does</h2>  
         <p className="text-gray-600 mb-8">  
          DHPrimer: Tutorial Lab is a local-first, privacy-preserving learning environment for Digital Humanities methods. It provides interactive, browser-based lessons with live coding challenges, note-taking, and progress tracking—all stored entirely in your browser. No accounts, no servers, no data leaves your device.</p>  
      </section>  
  
<section>  
         <p className="text-gray-600 mb-8">  
          And yes, it's worth your time to learn the basics, even in an age where computers can write their own code.</p>  
      </section> 

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Why?</h2>
         <p className="text-gray-600 mb-8">
        This site is meant as both an introduction and a reminder of basic digital humanities literacies. In my teaching, I have found that there still needs to be some sort of support for students, <em>before</em> they begin to explore the excellent <a href="https://programminghistorian.org/"><u>Programming Historian</u></a> tutorials, or Melanie Walsh's wonderful <a href="https://melaniewalsh.github.io/Intro-Cultural-Analytics/welcome.html#"><u>Introduction to Cultural Analytics</u></a>. This site allows the student to get a handle on the fundamentals, and the language of coding and DH <em>without</em> having to install and configure their own machine. Once a student has worked through these materials, they should then be ready for the in-depth tutorials from The Programming Historian or Introduction to Cultural Analytics.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pyodide</h2>
         <p className="text-gray-600 mb-8">
      This site, at least in its first iteration, uses Pyodide to power the sandbox's use of Python (eventually, we might implement support for R). This means that not every Python package might want to use can be used here; in those cases, the exercise code is meant to demonstrate the general principle at play. <br></br><br></br>The left hand side of the screen will show sometimes what the code might look like when using the most appropriate package (eg, 'numpy-stl' for making 3d print files from data, in the 'Topographies of Data' lesson), and so you may wish to try a more powerful environment like Google Colab with those examples. Otherwise, the curious can try to import packages directly into the sandbox using: 
<br></br><br></br>
      <pre>import micropip<br></br>
await micropip.install("name-of-package")</pre>
<br></br> but this can't be guaranteed to work.
</p></section>

      <section>  
        <h2 className="text-lg font-semibold text-gray-800 mb-4">How it works</h2>  
        <ul className="text-gray-600 mb-8">  
          <li><strong>Static curriculum</strong>: Lessons and modules are bundled at build time from <code>src/data/lessons.ts</code> and <code>src/data/modules.ts</code>.</li>  
          <li><strong>Runtime state</strong>: Your profile, pathway, progress, and notes are managed by three Zustand stores and automatically persisted to localStorage.</li>  
          <li><strong>Code execution</strong>: Python (Pyodide) and R (WebR) run in your browser via WebAssembly, with no remote execution.</li>  
          <li><strong>Onboarding</strong>: A short flow captures your background and interests to generate a personalized learning pathway.</li>  
        </ul>  
      </section>  
  
      <section>  
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Lesson page elements</h2>  
        <ul className="text-gray-600 mb-8">  
          <li><strong>Left pane (40%)</strong>: Renders lesson content (Markdown) with learning objectives and a “Mark Complete” button.</li>  
          <li><strong>Right pane (60%)</strong>: CodeSandbox with editor, output console, and challenge tabs.</li>  
          <li><strong>Sandbox controls</strong>: Run Code, Check (validates against expected output), Reset, Show Solution, and hints.</li>  
          <li><strong>Visual output</strong>: If code generates plots, a “View Plot” button opens a modal to download PNG/SVG or save to notes.</li>  
          <li><strong>Floating Notes button</strong>: Opens a slide-over NotePanel to create or browse notes linked to the current lesson.</li>  
        </ul>  
      </section>  
  
      <section>  
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Export page elements</h2>  
        <ul className="text-gray-600 mb-8">  
          <li><strong>Obsidian export</strong>: Generates a zip of Markdown files for your notes, preserving tags and lesson links.</li>  
          <li><strong>Progress summary</strong>: Lists completed lessons, challenge attempts, and timestamps from the progress store.</li>  
          <li><strong>Pathway overview</strong>: Shows your personalized module sequence and estimated hours from the user store.</li>  
          <li><strong>Download options</strong>: You can download notes as Markdown, progress as JSON, and captured plots as images.</li>  
        </ul>  
      </section>  
  
      <section>  
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Privacy & offline</h2>  
        <p className="text-gray-600 mb-8">All data stays in your browser. No analytics, no tracking, no server communication. You can use the app offline after the initial load of Pyodide/WebR from CDN (cached thereafter). To back up your data, use the Export page.</p>  
      </section>  

      <section>  
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Who built this?</h2>  
        <p className="text-gray-600 mb-8">This project was supported through a Teaching Award from Carleton University. The project was conceived and designed by Shawn Graham, and implemented after a series of experiments with various flavours of 'literate programming' approaches. Some of it was hand-coded by Shawn, while other parts were developed in the context of his 2024/25 HIST4805a seminar on AI and/of History class. Some of the plumbing was created through a careful process of defining a specification and iterating with Claude Opus 4.6. The framework developed can be forked on <a href="https://github.com/XLabCU/"><u>Github</u></a> and redeployed with new content, so feel free to do so for your own teaching purposes.</p>  
      </section>  
    </div>  
    
  );  
}