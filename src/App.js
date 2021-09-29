import './App.css';
import CreatePost from './components/CreatePost';
import DispalyPosts from  './components/DisplayPost';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

function App() {
  return (
    <div className="App">
       <AmplifySignOut />
      <CreatePost />
      <DispalyPosts/>
    </div>
  );
}

export default withAuthenticator(App, {
  includeGreetings: true
});
