import './App.css';
import CreatePost from './components/CreatePost';
import DispalyPosts from  './components/DisplayPost';
import { withAuthenticator } from 'aws-amplify-react';

function App() {
  return (
    <div className="App">
      <CreatePost />
      <DispalyPosts/>
    </div>
  );
}

export default withAuthenticator(App, {
  includeGreetings: true
});
