# What is piracy.land?

Piracy.land tries to change the game of the internet. In doing so it'll steal everyone's lunch. Nothing is better than a free lunch?

# What is piracy.land?

Piracy.land is a schema for microfrontends to be assembled at runtime. This means the site does nothing, but can be made to do anything. You assemble a collection of microfrontends and get an experience. You change a peice, you get a different experience. Meanwhile the frontend creators have limited to zero cost of operation. Cost decreases as users increase. Performance increases as users increase. With a few hundred users of your frontend you'll no longer need to host it. It'll live forever. No matter what anyone does. It will live forever.

# How does piracy.land work?

The premise is simple. Distribute everything over torent protocols. This has immediate downsides. The initial fetch of an app is slower than loading a page. But after you have it you will cache it and share it. Speeding up other users access to the app and reducing future load times to zero.

Visiting the page will spin up a service worker with a stale-while-validating approach to data. As updated versions are found the microfrontends are replaced based on user preferences. Each microfrontend is independent. An update to your search bar frontend will not cause a full page refresh, instead only that portion of the page will refresh.

What you fetch is either the default, a view of the experience registry, or whatever you set. The settings are persisted between sessions. Allowing you to configure things how you'd like and get it immediately. You can build an ebook reader, video viewer, audio player, literally anything. This collection of settings is persisted in an application manifest file, which you can share to anyone via URL. This can be as specific as a specific video in a specific video player implementation at a specific timestamp, with a combination of settings to cause a specific bug to occur. 

These application manifests become the experiences within the experience registry. You can tour them as you desire. You can find an implementation of peer-to-peer distributed roms and emulators with search and autocomplete. You can find a fork of that same experience that adds peer-to-peer play, hacking games from previous versions to have netplay. You can find a video viewers with search experience that automatically fetches the videos from a torrent registry. Exposing all the world's movies in a nice clean view.

## Walkthrough

The manifest and microfrontends make this easier. Lets walk you through.

You start on the home page, an experience registry with a search bar. You search for things, the search results update, you click on the search results and you dive into a page presenting that particular experience.

Let's be real, you probably aren't going to spend hours on that experience. You'd want to search for other things, you'd probably want to do something different with them. Lets change how you use it. 

In the editor you can change your backing registry, which describes what search results you get. In this case we're looking at experiences. But we could make it point at project guttenberg's archive of ebooks. 

After you do that your search results will return lots of books. You can dial them down, and then try to open them.

Unfortunately when you try to open it, nothing will happen. Well, almost nothing. You've gotten a popup. This is saying you do not have a protocol handler setup for ebooks, and asks you if you'd like to set one. Lets follow along.

You're now looking at a search of experiences that allow you to read ebooks. The official ebook reader is what we'll use in this example. Not because its good, its almost certainly worse than other options. But it is known to be safe. In other cases you'll have to figure out which are trustworthy yourself. More on that in [How to decide what is trustworthy].

Now that we've set the ebook reader we return to opening the ebook, which now is fetched from project guttenberg and rendered in your ebook reader.

Now ask yourself, what do you want to do? Do you want a replacement for youtube? Netflix? Spotify?

What would you have to change to get that?

In this walkthrough we only changed the backing registry. You could find a registry for these things by looking for a registry microfrontend in the registry. A quick search for 'movies', 'youtube', 'netflix', 'music', or 'spotify' would give you such a microfrontend. Plop it in and your search will automatically work with that. Clicking on a result and you'll be prompted to find a microfrontend for that service.

Welcome to level one of understanding. You can do anything, just replace things with similar things.

Be sure to save your favorites by clicking here.

## Going Deeper

Under the hood all microfrontends talk to one another through a pub-sub. Each app describes what events it publishes and what events it subscribes to. If you have all these events you'll get something. Is it what you need? Well, maybe. The descriptions might help you know if it will, but running will let you know for sure.

Each event has a shape described by the event schema. We have made the initial event schema, but if it doesn't match your needs you can use others. They might not work with apps from other schemas, but they might. If they don't you might be able to fix it with a [transformer].

The microfrontends are distributed over torents. This means you give it to others and they give it to you. As long as a single computer out there in the world is on and has the microfrontend you're looking for you can get it. If everyone abandons something it'll fade into the past. The bootloader (the homepage) is also distributed over torents. As long as someone has it anyone can get it. This app will only go away if everyone stops using it. It's probably around forever.

The registry is similarly distributed. In our case it is weekly published torrent files. In other cases other approaches may happen. The most natural way to add features will be to connect to existing services. You can query many existing torent registries through a suitable microfrontend. This will handle the burden of translating our language to their language for you. And if it doesn't exist someone can relatively easily implement it. Rather than having to make a whole site, all they have to do is solve a single small problem. An ideal situation for development.

The inner workings of the application are similarly configurable. What happens when you type things in the URL bar? Well the url parser microfrontend handles it. What happens when you try to make an external network request? Well a networking microfrontend handles it. What happens when you try to load a microfrontend? Well the microfrontend container handles it. How does loading happen? Well the orchestrator handles that. Each are tiny parts that can easily be thrown away or replaced. In many cases it will make more sense to just make a new one rather than fix old ones. Adapting other solutions to similar problems. In each case who and what does this are defined in your application manifest. You can replace every default, load anything, all you'd like. So long as the part you replaces conforms to what other parts expect, it will probably work.

But you really don't need to do any of that. Ultimately you can just find an existing experience that matches your goals, running it as is to get something you want. If you don't like something about it, you can tweak it from there. 


