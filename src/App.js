import './App.css';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

function App() {
  var publicKey = '';
  navigator.serviceWorker.register('./sw.js');

  async function getPublicKey() {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user.signInUserSession);
    const token = user.signInUserSession.idToken.jwtToken;

    var request = new XMLHttpRequest();
    request.open(
      'GET', 
      'https://api.a.breadth.app/dev/breadth/key_for_notifications',
      true);
    request.setRequestHeader("Authorization", token);

    request.onload = function () {
      publicKey = JSON.parse(request.responseText).key;
      console.log(publicKey);
    };
    request.send(null);
  }

  async function setupEndpoint() {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user.signInUserSession);
    const token = user.signInUserSession.idToken.jwtToken;

    Notification.requestPermission(function (status) {
      console.log('Notification permission status:', status);
    });

    if (Notification.permission === 'granted') {
      let sw = await navigator.serviceWorker.register('./sw.js');

      let push = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });
      console.log(JSON.stringify(push));

      var request = new XMLHttpRequest();
      request.open(
        'POST', 
        'https://api.a.breadth.app/dev/breadth/post_endpoint',
        true);
      request.setRequestHeader("Authorization", token);

      request.onload = function () {
        console.log('Endpoint created and pushed successfully!');
      };
      request.send(JSON.stringify({
        item: JSON.stringify(push)
      }));
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getPublicKey}>Get the Public Key</button>
        <button onClick={setupEndpoint}>Setup Endpoint</button>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
