# The Challenge

Web technologies have seen tremendous changes in the last years. The toolchains we currently have available allows us to build incredible web applications, while making our lives easier, by providing us libraries and frameworks that others have developed, on top of which we can build on. As a web engineer, you are expected to develop solutions based on these tools, and to build your own when necessary.

In this challenge, we aim to assess your skills to build both the frontend and backend components of an application.

Our games have user avatars, user drawn skins, and other user generated media that need to be moderated to prevent offensive content.

Build a system to help us manage user generated images. The following requirements must be fulfilled:

1. The system must expose an endpoint to receive an image report.
2. The report submission endpoint needs the following parameters
   a. receives the image URL of the image being reported, or bytes of it
   b. an identifier for the user that generated the report,
   c. callback endpoint, so that the system invoking the report can be notified when the image is moderated (if report was approved or rejected)
3. The system must store a copy of the image (people can change their avatars in between the report time and evaluation time, for example)
4. Automatically evaluate the image using some automated evaluation system for prefiltering
   a. Try to classify images that might contain sensitive content, such as pornography, violence, drugs, weapons
5. Store the image reports and the evaluation results in durable persistence.
6. Provide a backoffice to manage the image reports, with the following features:
   a. View reports, sorted by decreasing probability of containing sensitive content.
   b. Reports whose automated evaluation did not complete yet must also be shown, but with the lowest priority.
   c. Approve or reject reports
   i. This approval or rejection must notify a callback endpoint (check point 2c)
   ii. After approval or rejection, the report can be archived, and will no longer show up in the main listing
   d. Manually submit new images to be evaluated.

You are free to choose a language and frameworks you feel are more appropriate, within the following parameters:

- Use a frontend library such as Vue.js (or React).
- Use Docker (and docker-compose) for provisioning (See the Deployment section)