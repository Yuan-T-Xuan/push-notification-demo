self.addEventListener('push',
    function(e) {
        console.log(e.data.text());
        var parsed = JSON.parse(e.data.text());
        var options = {
            body: parsed.body
        };
        e.waitUntil(self.registration.showNotification(parsed.title, options));
    }
);
