Introduction

NUVI is a Social Media Analytics company. Part of our business is visualizing and interacting with social media activities, such as tweets, Facebook posts, and Instagram posts.


Getting Started

Your project is to write a browser UI that displays these activities and allows you to interact with the "actors" of these activities, such as liking or replying to these "actors".

https://nuvi-challenge.herokuapp.com/activities

We have a RESTful JSON endpoint for data. It will always return an array of objects which describe the activity. This array could be empty but will typically include 10-500 social media activities.


Analysts using our product typically need to know what social media “provider’ it is from (e.g. Twitter, Facebook, Instagram, Reddit), the username on that social media site, the content of the activity, including media, and when it was posted. Other meta data included in the activity is useful as well to represent but we also care about keeping a clean UI.


Once you’ve built this UI in JavaScript, commit it to a GitHub repo and send it our way. If it requires a build, please commit the built javascript as well and include a README.md if there are some special steps on how see the html and javascript.


Bonus

Social Media Analysts use our product to take action on large quantities of activities and take actionable insights on them. Build a visualization that allows them to understand better how social media conversations about their brand are going, using the data provided.

Bonus Bonus

Manually write an HTTP request to get the JSON data at the endpoint in a plain text file, include the cookie “SESSION” with the value of “NUVI-12345” and commit it as “request.txt”.