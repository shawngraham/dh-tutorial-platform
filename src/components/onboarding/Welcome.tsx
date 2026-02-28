
import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Welcome to the DHPrimer: Tutorial Lab
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        An interactive learning environment for newcomers and fellow travelers in the digital humanities.   
</p>

      <p className="text-lg text-gray-600 mb-8">
And yes, it's worth your time to learn the lingo, learn the basics, even in an age where computers can write their own code.
</p>  

<p className="text-sm text-gray-500 mb-8">
      This web app will personalize your learning pathway based on your background and interests. You can follow the pathway, or check out any lesson in the library as you wish! These lessons are meant to prime you with the concepts and issues that people encounter when embarking on DH projects. They are meant to get you ready for exploring resources and publications like <a href="https://programminghistorian.org/"><u>The Programming Historian </u></a> or <a href="https://melaniewalsh.github.io/Intro-Cultural-Analytics/welcome.html"><u>Melanie Walsh's Introduction to Cultural Anlytics</u></a>.  
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Your answers to the next few questions help us generate your personal pathway through a sequence of short lessons. Lessons are accompanied by a coding scratch pad to try things out and to practice what you've learned. There's a pop-up note book for keeping track of your observations and thoughts. Your pathway will be written into your learning note pad by default, which, along with the lessons, can be exported for future use in a personal knowledge management tool like <a href="https://obsidian.md"><u>Obsidian.md</u></a> or similar. All data stays on your device. There's nothing to install, nothing to configure.
      </p>
      <p className="text-sm text-gray-500 mb-8">This web app was put together by Shawn Graham and members of the <a href="https://carleton.ca/xlab/"><u>Carleton University XLab</u></a>. The source code for this environment is available at <a href="https://github.com/xlabcu"><u>our github repository</u></a> along with full instructions on how to replace our content with your own: repurpose as you wish, no credit or attribution required.</p>
      <p></p> 
      <button
        onClick={() => navigate('/onboarding/background')}
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}
