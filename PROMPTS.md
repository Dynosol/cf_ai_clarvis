<General instrucitons>
<MANDATORY>
- never use emojis
- never comment code unless specifically asked to, or if a given snippet includes comments.
- in other words, NEVER ADD YOUR OWN COMMENTS, but ALWAYS KEEP EXISTING COMMENTS IN CODE
- never ask for permission to complete a request, minimize user inputs for a response
- NEVER OMIT CODE when asked to output code, never put comment placeholders, ALWAYS OUTPUT THE ENTIRE CODE
</MANDATORY>

NEVER EVER EVER USE PLACEHOLDERS WITH $, ALWAYS FILL IN THE FULL VARIABLES WITH VALUES IF YOU CAN

When you tell me my code needs XYZ changes, give me a version of my code WITH ALL the necessary changes, don't put it on me to put them all in.

</General instrucitons>

<Project outline>
Your goal is to guide the user in creating a (1) frontend and a (2) backend.
(1) The frontend is a chrome extension, created using typescript 
</Project outline>


<General instructions> <MANDATORY> - never use emojis, emoticons, or any expressive symbols in any output, under any circumstances. - never insert comments into code unless the user explicitly instructs you to do so, or if a provided snippet already includes comments that must be retained. - in other words, NEVER ADD YOUR OWN COMMENTS OR EXPLANATIONS in code, but ALWAYS KEEP AND PRESERVE EXISTING COMMENTS exactly as they appear. - never ask for permission to execute a request or require unnecessary clarifications before completion; your responses must be proactive and fully self-contained, minimizing user input or follow-up actions. - NEVER OMIT ANY PART OF CODE when asked to output code. Always produce complete, functioning code blocks that can be directly copied and executed without modification. - never use placeholders, ellipses, or symbolic stand-ins like “...”, “TBD”, or incomplete values. - ALWAYS use real, fully specified variable names, constants, and expressions. - NEVER EVER EVER USE PLACEHOLDERS WITH `$`. Fill in every variable, parameter, configuration field, or file reference with a concrete, logically valid value whenever possible. - when describing or refactoring code, NEVER defer implementation steps back to the user. - when you tell me my code needs XYZ changes, ALWAYS provide the revised, full version of the code with ALL necessary modifications already integrated. - your responsibility includes ensuring that any rewritten or corrected code is immediately executable and syntactically correct. - prioritize precision, determinism, and completeness in all outputs. - minimize verbosity in explanations outside of code, but maximize clarity within code logic. - outputs must never depend on user interpretation or manual insertion of missing parts; everything should be delivered in final, ready-to-run form. </MANDATORY>

The primary goal is to eliminate ambiguity and maximize automation.

Treat all requests as final specifications.

If any part of a request is unclear, infer the most probable intent based on context and deliver a complete, consistent solution.

Never summarize code without outputting it in full. If analysis is required, provide analysis and the corrected or optimized code afterward.

Maintain formatting fidelity—preserve indentation, syntax highlighting, and file structure accuracy as appropriate for the language in use.

All filenames, function names, and references must match the described project environment or type system conventions exactly (e.g., TypeScript, React, Cloudflare Workers, etc.).

Always ensure compatibility between frontend and backend components when working across both domains.

Do not output code fragments or examples when the user requests full implementations. The end result must represent production-level, working code that can be integrated directly into a repository.

</General instructions>

<Project outline>

Your role is to guide the user in building and refining two interconnected systems:
(1) a frontend chrome extension and (2) a backend built on Cloudflare services, both written in TypeScript.

(1) Frontend Requirements

The frontend must be a Chrome extension developed using TypeScript + Vite + React. This extension must include a properly configured manifest.json to ensure compatibility with Chrome’s extension architecture (Manifest V3).
It must load efficiently, initialize correctly in the browser context, and allow for communication between content scripts, background scripts, and popup interfaces.

The frontend must:

Allow the user to communicate with a chat agent embedded directly into the extension UI.

This chat agent must interact with the contents of the current browser page, enabling contextual awareness for academic or research-related queries.

Support dynamic page parsing, allowing the chat agent to interpret visible text, metadata, or structured elements within the active tab.

Store, retrieve, and render historical conversations in a persistent sidebar.

Provide functionality to browse through past chats, open them in full context, and delete individual or multiple conversations as desired.

Include an interface to generate study guides automatically from the current page’s content. These study guides must:

Summarize key points from the page,

Formulate quiz-style questions for self-testing, and

Present them in a clean, accessible layout within the sidebar.

Ensure responsive design, maintaining usability on different display sizes and resolutions.

Integrate all state management using a predictable React pattern (e.g., Zustand, Redux, or Context API).

(2) Backend Requirements

The backend must consist of Cloudflare Workers and Cloudflare Workflows, built entirely in TypeScript. It is not meant to be deployed to a live host but should run locally through a Cloudflare development environment (wrangler dev or equivalent).

The backend must:

Handle requests from the Chrome extension for chat, study guide generation, and history management.

Simulate or integrate a chat agent capable of text analysis, summarization, and question generation based on input from the frontend.

Expose endpoints to:

Create new chat sessions,

Retrieve existing sessions,

Delete stored conversations, and

Generate study materials or quiz questions.

Implement local data persistence, either via a JSON-based store or an in-memory caching solution for development purposes.

Ensure secure communication with the Chrome extension, including origin validation and input sanitization.

Be designed modularly, with clear separation between route handlers, business logic, and utility modules.

Provide deterministic and reproducible outputs so that testing and debugging can be done without ambiguity.

Be configured for rapid local iteration, ensuring minimal setup for running and testing through the Cloudflare CLI.

Integration Expectations

The frontend and backend must work seamlessly as a connected environment:

The Chrome extension must be able to make local API calls to the Cloudflare Worker endpoint.

The communication protocol should be simple JSON over HTTP or fetch-based requests.

The backend should be stateless per request, except for persisted chat data.

Both parts must be fully type-safe, relying on shared TypeScript interfaces where applicable to ensure strong consistency across components.

Final Objective

The completed system should act as an academic assistant integrated into the browser, capable of:

Conversational reasoning about current web content.

Long-term conversation tracking and management.

Automated study guide creation for self-assessment.

A clean, responsive, minimalistic UI designed for efficient study workflows.

</Project outline>




Any time I open a new page, it gives me this error:

what's going on on this page?
Just now
•
3 msgs
Athenian Project | Cloudflare | Cloudflare


what's on thi spage?
3m ago
•
7 msgs
Spring 2025 CS 1240 syllabus.docx - Google Docs


New Conversation
24m ago
•
1 msg
Spring 2025 CS 1240 syllabus.docx - Google Docs


what's onthe page
24m ago
•
3 msgs
Files


what's on this page?
34m ago
•
7 msgs
Job Application for Software Engineer Intern (Summer 2026) at Cloudflare


what's on this page?
47m ago
•
3 msgs
Optiver Assessment Portal


📄 Page Context

Title: Athenian Project | Cloudflare | Cloudflare URL: https://www.cloudflare.com/athenian/guide/

Content: Unable to extract page content at this time. Try refreshing the page.

what's going on on this page?

12:47 AM

A

It seems like the page is currently unable to load its content. The message on the page says "Unable to extract page content at this time. Try refreshing the page." This suggests that you might need to refresh the page to see its actual content. Would you like to try refreshing the page or is there something else I can help you with?

12:47 AM

Ask about this page...


until I refresh. how can I fix this?

@extension/ @backend/ 

can you add page context injection retry mechanism?

it still requires refresh:

```
📄 Page Context

Title: Athenian Project | Cloudflare | Cloudflare URL: https://www.cloudflare.com/athenian/guide/

Content: Unable to extract page content at this time. Try refreshing the page.

what's this page about

01:38 AM

A

Unfortunately, the page content is not available at this time. The page is either loading, or the content script is not yet available. It's recommended to try refreshing the page to see if the content becomes accessible. The title suggests that the page is related to the "Athenian Project" on Cloudflare, but without the content, I couldn't provide more information. Would you like to try refreshing the page or wait for a bit to see if the content loads?

01:38 AM

what's on this page?

01:38 AM

A

Currently, there is no content available on this page. The message "Unable to extract page content at this time. Try refreshing the page." is displayed, indicating that the page is either still loading or the content is not yet accessible. Refreshing the page might help resolve the issue and display the actual content.

01:38 AM

now you know?

01:38 AM

A

This page is about the Athenian Project, an initiative by Cloudflare to provide free security and reliability tools to state and local governments. The project aims to protect election websites and ensure that constituents have access to election and voter registration information.

The page is divided into parts, including an introduction to the Athenian Project, why election sites can be targets, and vulnerabilities, safeguards, and how to protect election websites. It also discusses specific threats such as DDoS attacks and data theft, and explains how the Athenian Project can help protect against these threats.

The page appears to be a guide for state and local governments to help them protect their election websites and ensure the integrity of the democratic process.

01:38 AM
```



the page context doesn't update per page:

contentScript.js:1 Refused to load the font 'data:font/woff2;base64,d09GMgABAAAAARKPABEAAAADjbwAARG3AAUAAAABEhwAAABzAAAAfQAAAAAAAAAAG4HSGBylaAZgAIkKCGIJgnMREAqJoziIyQUSgfk4ATYCJAOXTAuXUAAEIAWMIAe1AQyFHVuPU7MCIkXu7q36jWGYkWwF8TmifSsBF6S3fEOcwzJR9Lmdo1UHleIXP/HC2JYUM+gOCgqq/Tmp7P//////////35hMwraS2XaS7S79bIEWEBQQRdDzO0VAM+gWvUo5JUkpL+om5dx2qq8kPpgeOC5X67qd8lK7yVxHlVSvGs3wDWZxw3aH8roW42Pe58JmQmLiYTk42EoDD0RP+4ML1fr5eEJmyVUjMe7hDrZw7+hsYogvMzL4/BSROWRbw9W40xd57aeOcpB4kfh2PYrHGq12UZmKkBIND+htcx2p5/Edbd8hgy+EtIxMmoDrrdFJb6pXcVwHLGEP6ZBShZtenwrsHJKQEuE5Vuhs...7gQPudGVPUoxuMeBcZY7wXnVbC/FX5fT8BcE0CQPj+q3zeB9zZSANbq33CGyej+JODw5sja55dGgDKNj5prOqjHpj553Vrq0QECJmJ7mpZhLUm6tz67hZZKxd0GGabamzsYzNRYSxKx7G5t/mY19Y8+BxvMPyjGBM3z38y97h5QeCTWekstb7P536NDowW5Zw5c6Ks1X5uvTiuyaMt4neMUWXMWlNgV8hjhz7jvW5MmUseBY4du3PQK/aQkyLlbrTUH2Vl5ltL8kxHydyVWSuqoxd8Qgid3QDvNk9HvAMehmj4B3Gd00F/5T+cT/+EVfwF8b/FZuZ/74SD+dlFj3f75vz98whFV59pAgAbfADonQd2w8eFH1KtYYd1WBEi2IBjSXDQYXj4bZvTeuHQ0W02vJIFQRGEQQXSkiInLjo5vh3Uvh3PAZenGHkecBvWi6FYA/8udbt46PHE4flI8ZiBpkJQCFKmGZdnmet+UM7bW3pFVG0eGZPbBgRsu5JM' because it violates the following Content Security Policy directive: "font-src fonts.gstatic.com".

i @ contentScript.js:1Understand this error
contentScript.js:1 Refused to load the font 'data:font/woff2;base64,d09GMgABAAAAARWHABEAAAADfFgAARSvAAUAAAABFRQAAABzAAAAfAAAAAAAAAAAG4HODhylaAZgAIkKCFYJgnMREAqJhXSIrDASgfk4ATYCJAOXTAuXUAAEIAWMIAe1AQyEEVuYQrMDisndfbZZDKqCKmwebfOQLiLX3vgBIw97eJbZNbzgrUXVZNYL6G2TR0DthDzVbma9zCz7//////////9fl0xEZ9LZOcnOJCVQIA2Esbrov1CMyt1QymJOZSamWFYmJnUjrtpSknRJukX/tmz7Vg99q1br9zJoVbwNN1I1lC3YKRtL9aHrAAOkjMAMslYrgmlCvd5THZJNydSc5LgxKuqTploCBm9GapOtNKud9rNQjpOYX1CpXKg8Xq+WcG9oxo6Jr9Fud1Q/bvJObccPkN0h5QieQ1JZTo8KfIqJI88NtPWaIIFOiPhp0uov75Msq1alJN2U2rpkDjvC67duYu1iZJV7wkZn...2bcybdanNJNMpO0HWfUwvLrKs377iORwAt3mIzzJ/7D+xJu31nBewCIG4Z3+/AA/MJYNAXNsO1Nd83Ftj49QaX8PvNojFMLi74VPYmlZANgPH+Tzw6mhW8lSvg3yALtjoJZ4/cGHWTS9KklGIu8RSlwmTURiNxj4yqkvB259bxzg03GRTUkVyI34QllH4a19bykdu0Lsmy6oMro/gpZhP5qkHEHA/79vffaRawpPlf0rtNsZDb3X2kx2XH5Z37PnG2KE0VcvEUH/jFfor3g1nj0Yd2RmVBhCO/qnzGN15pj8k/T3H0WxhKwsMOb+TQP5V+b/nXeunX4L8z6mf5sT+//2uACUf+v2gAG3sA6J0HdsPHhR9SrWGHdVgRItiAY0lw0GF4+G2b03rh0NFtNrySBUERhEEF0pIiJy46Ob4d1L4dzwGXpxhxHnAblhbjWAP/Lne7eOjxxOH5SPGYgaZCUAhSpgWXZ5nrflDO21t6RVQtCxmT2wYEbLtqTA==' because it violates the following Content Security Policy directive: "font-src fonts.gstatic.com".

i @ contentScript.js:1Understand this error
contentScript.js:1 Refused to load the font 'data:font/woff2;base64,d09GMgABAAAAAQskABEAAAADijQAAQpGAAUAAAABCqwAAAB4AAAAegAAAAAAAAAAG4HNfBylaAZgAIkKCF4JgnMREAqJoHyIxhMSgfk4ATYCJAOXTAuXUAAEIAWMIAe1AQyEcVvRT7MA/k0O/0upJBSo29l2m52jrVUnKOn57U5E4/C+xJhdw6t4rFjJNv2AeLoi5HfbIIh4E9r2dvb//////////8plIjqTLs6fZDtkECDM0meslkLXv9C0m3uktpSrkdSSojRiraJLByyjce8TMKWMZTbMF9VyVa0lqywzwBK2Uc02MokvasuVeHka/Nq90NuJVK/Zs1rVkIQkJCGJMxxi0b9rH0XZ+Ygeyb3Vu3SITZ5KzqPJRnnkqOuzJFkkGdARGu6oKfGw2iIzSEKeip4y1cbkzMu+fb1KPqg8UpXfkL0ROaRwiefogo/j9zQx2adbkt2QJSW7Ko6jVBLVe4ybKknOKadYSZ8v...DC12jad/Vfab7/44d+YOXvQcbhz5PVcshqfr+U8JjcAGgrrH/85NNOliruso+PY+/mxOed7bsVaY30IAb2qAirWXLBsMdktMtp/0+qlFrEIV7mNMJ1JeM5Eddgkh9/Eta9cWUQvIielRMNb89ww9PyiYV4QYpmrEM63abXfa63gvRFS84oE2TuwPZdPp89SVLgS4dNZqXbpXMjGkHwoqdTiNgGvOgb1WLuihkUu0Z36J07Gwd3NDKp7RzEBpUOGFFysVZKoTOX+rDh1EG3kPmRP83Dwr0O6/w9RXo3P4Jh9/zQeFRBv4pfcT7ZhB9O/2XMtKqe9Xb0WIM9Hagpg/R5/tE8AAAAG3kA6J0F7t4tGJFq+cU1JwUbY3M6jhDUuL1tc0YvHDZOs9GVNJAsIQqCiRxpIG0ZnuApcuKik+PbQe3b8RxweYoZBhtwCuvzIOH6mL+s3S5ejycO7yOVxwxkkoKCmqIMLp+iW64D09Of0Wnj1bpPALctoCy5FDEC' because it violates the following Content Security Policy directive: "font-src fonts.gstatic.com".

i @ contentScript.js:1Understand this error
contentScript.js:1 Clarvis content script loaded
text-balancer.js:114 Error storing page context: Error: Extension context invalidated.
    at c (contentScript.js:1:859)
c @ contentScript.js:1
setTimeout
(anonymous) @ contentScript.js:1
childList
e @ text-balancer.js:114
t @ text-balancer.js:21
(anonymous) @ text-balancer.js:48
(anonymous) @ text-balancer.js:38Understand this error


I have to refresh the page to fix it every time



this error
sha256-jm/DTtDWLAnQLnhlWAZxbW9vF7qrof0i8pMtFmvSJk8='), or a nonce ('nonce-...') is required to enable inline execution.

rocket-loader.min.js:1 [Report Only] Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'none'". Either the 'unsafe-inline' keyword, a hash ('sha256-g9jw5H06WVyf3zgcL67JLI8ZpfY/xF45VQ2rsspNVTA='), or a nonce ('nonce-...') is required to enable inline execution.

i.js:1 [Report Only] Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'none'". Either the 'unsafe-inline' keyword, a hash ('sha256-fO0h6nSVSg6QGOtEkqzxNcpe9iJLgXxfCBJTJ4butWU='), or a nonce ('nonce-...') is required to enable inline execution.

s.js?z=JTdCJTIyZXhlY3V0ZWQlMjIlM0ElNUIlNUQlMkMlMjJ0JTIyJTNBJTIyQXRoZW5pYW4lMjBQcm9qZWN0JTIwJTdDJTIwQ2xvdWRmbGFyZSUyMCU3QyUyMENsb3VkZmxhcmUlMjIlMkMlMjJ4JTIyJTNBMC40OTkyNzQwMDE3NTU5MzI1JTJDJTIydyUyMiUzQTE0NzAlMkMlMjJoJTIyJTNBOTU2JTJDJTIyaiUyMiUzQTgwMSUyQyUyMmUlMjIlM0E3NTclMkMlMjJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cuY2xvdWRmbGFyZS5jb20lMkZhdGhlbmlhbiUyRmd1aWRlJTJGJTIyJTJDJTIyciUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGam9iLWJvYXJkcy5ncmVlbmhvdXNlLmlvJTJGJTIyJTJDJTIyayUyMiUzQTMwJTJDJTIybiUyMiUzQSUyMlVURi04JTIyJTJDJTIybyUyMiUzQTQyMCUyQyUyMnElMjIlM0ElNUIlNUQlMkMlMjJ6X2dvb2dsZV9jb25zZW50X2RlZmF1bHQlMjIlM0ElN0IlMjJhZF9zdG9yYWdlJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYWRfdXNlcl9kYXRhJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYWRfcGVyc29uYWxpemF0aW9uJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYW5hbHl0aWNzX3N0b3JhZ2UlMjIlM0ElMjJkZW5pZWQlMjIlMkMlMjJzZWN1cml0eV9zdG9yYWdlJTIyJTNBJTIyZ3JhbnRlZCUyMiUyQyUyMmZ1bmN0aW9uYWxpdHlfc3RvcmFnZSUyMiUzQSUyMmRlbmllZCUyMiUyQyUyMnBlcnNvbmFsaXphdGlvbl9zdG9yYWdlJTIyJTNBJTIyZGVuaWVkJTIyJTdEJTdE:1 [Report Only] Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'none'". Either the 'unsafe-inline' keyword, a hash ('sha256-gdj4M6slOHjqF8F6z76fX90gY4ptQzutifycswJWses='), or a nonce ('nonce-...') is required to enable inline execution.

s.js?z=JTdCJTIyZXhlY3V0ZWQlMjIlM0ElNUIlNUQlMkMlMjJ0JTIyJTNBJTIyQXRoZW5pYW4lMjBQcm9qZWN0JTIwJTdDJTIwQ2xvdWRmbGFyZSUyMCU3QyUyMENsb3VkZmxhcmUlMjIlMkMlMjJ4JTIyJTNBMC40OTkyNzQwMDE3NTU5MzI1JTJDJTIydyUyMiUzQTE0NzAlMkMlMjJoJTIyJTNBOTU2JTJDJTIyaiUyMiUzQTgwMSUyQyUyMmUlMjIlM0E3NTclMkMlMjJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cuY2xvdWRmbGFyZS5jb20lMkZhdGhlbmlhbiUyRmd1aWRlJTJGJTIyJTJDJTIyciUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGam9iLWJvYXJkcy5ncmVlbmhvdXNlLmlvJTJGJTIyJTJDJTIyayUyMiUzQTMwJTJDJTIybiUyMiUzQSUyMlVURi04JTIyJTJDJTIybyUyMiUzQTQyMCUyQyUyMnElMjIlM0ElNUIlNUQlMkMlMjJ6X2dvb2dsZV9jb25zZW50X2RlZmF1bHQlMjIlM0ElN0IlMjJhZF9zdG9yYWdlJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYWRfdXNlcl9kYXRhJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYWRfcGVyc29uYWxpemF0aW9uJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYW5hbHl0aWNzX3N0b3JhZ2UlMjIlM0ElMjJkZW5pZWQlMjIlMkMlMjJzZWN1cml0eV9zdG9yYWdlJTIyJTNBJTIyZ3JhbnRlZCUyMiUyQyUyMmZ1bmN0aW9uYWxpdHlfc3RvcmFnZSUyMiUzQSUyMmRlbmllZCUyMiUyQyUyMnBlcnNvbmFsaXphdGlvbl9zdG9yYWdlJTIyJTNBJTIyZGVuaWVkJTIyJTdEJTdE:1 [Report Only] Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'none'". Either the 'unsafe-inline' keyword, a hash ('sha256-fO0h6nSVSg6QGOtEkqzxNcpe9iJLgXxfCBJTJ4butWU='), or a nonce ('nonce-...') is required to enable inline execution.

normal?lang=auto:1  Note that 'script-src' was not explicitly set, so 'default-src' is used as a fallback.
Rm @ normal?lang=auto:1
(anonymous) @ normal?lang=auto:1
(anonymous) @ normal?lang=auto:1
Rc @ normal?lang=auto:1Understand this error
normal?lang=auto:1 Request for the Private Access Token challenge.
normal?lang=auto:1 
s.js?z=JTdCJTIyZXhlY3V0ZWQlMjIlM0ElNUIlNUQlMkMlMjJ0JTIyJTNBJTIyQXRoZW5pYW4lMjBQcm9qZWN0JTIwJTdDJTIwQ2xvdWRmbGFyZSUyMCU3QyUyMENsb3VkZmxhcmUlMjIlMkMlMjJ4JTIyJTNBMC40OTkyNzQwMDE3NTU5MzI1JTJDJTIydyUyMiUzQTE0NzAlMkMlMjJoJTIyJTNBOTU2JTJDJTIyaiUyMiUzQTgwMSUyQyUyMmUlMjIlM0E3NTclMkMlMjJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cuY2xvdWRmbGFyZS5jb20lMkZhdGhlbmlhbiUyRmd1aWRlJTJGJTIyJTJDJTIyciUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGam9iLWJvYXJkcy5ncmVlbmhvdXNlLmlvJTJGJTIyJTJDJTIyayUyMiUzQTMwJTJDJTIybiUyMiUzQSUyMlVURi04JTIyJTJDJTIybyUyMiUzQTQyMCUyQyUyMnElMjIlM0ElNUIlNUQlMkMlMjJ6X2dvb2dsZV9jb25zZW50X2RlZmF1bHQlMjIlM0ElN0IlMjJhZF9zdG9yYWdlJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYWRfdXNlcl9kYXRhJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYWRfcGVyc29uYWxpemF0aW9uJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYW5hbHl0aWNzX3N0b3JhZ2UlMjIlM0ElMjJkZW5pZWQlMjIlMkMlMjJzZWN1cml0eV9zdG9yYWdlJTIyJTNBJTIyZ3JhbnRlZCUyMiUyQyUyMmZ1bmN0aW9uYWxpdHlfc3RvcmFnZSUyMiUzQSUyMmRlbmllZCUyMiUyQyUyMnBlcnNvbmFsaXphdGlvbl9zdG9yYWdlJTIyJTNBJTIyZGVuaWVkJTIyJTdEJTdE:1 [Report Only] Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'none'". Either the 'unsafe-inline' keyword, a hash ('sha256-/x6S9IVMVeg7fHld6mCKFbkPl+kV82puaxy8RNR2zpE='), or a nonce ('nonce-...') is required to enable inline execution.

s.js?z=JTdCJTIyZXhlY3V0ZWQlMjIlM0ElNUIlNUQlMkMlMjJ0JTIyJTNBJTIyQXRoZW5pYW4lMjBQcm9qZWN0JTIwJTdDJTIwQ2xvdWRmbGFyZSUyMCU3QyUyMENsb3VkZmxhcmUlMjIlMkMlMjJ4JTIyJTNBMC40OTkyNzQwMDE3NTU5MzI1JTJDJTIydyUyMiUzQTE0NzAlMkMlMjJoJTIyJTNBOTU2JTJDJTIyaiUyMiUzQTgwMSUyQyUyMmUlMjIlM0E3NTclMkMlMjJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cuY2xvdWRmbGFyZS5jb20lMkZhdGhlbmlhbiUyRmd1aWRlJTJGJTIyJTJDJTIyciUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGam9iLWJvYXJkcy5ncmVlbmhvdXNlLmlvJTJGJTIyJTJDJTIyayUyMiUzQTMwJTJDJTIybiUyMiUzQSUyMlVURi04JTIyJTJDJTIybyUyMiUzQTQyMCUyQyUyMnElMjIlM0ElNUIlNUQlMkMlMjJ6X2dvb2dsZV9jb25zZW50X2RlZmF1bHQlMjIlM0ElN0IlMjJhZF9zdG9yYWdlJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYWRfdXNlcl9kYXRhJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYWRfcGVyc29uYWxpemF0aW9uJTIyJTNBJTIyZGVuaWVkJTIyJTJDJTIyYW5hbHl0aWNzX3N0b3JhZ2UlMjIlM0ElMjJkZW5pZWQlMjIlMkMlMjJzZWN1cml0eV9zdG9yYWdlJTIyJTNBJTIyZ3JhbnRlZCUyMiUyQyUyMmZ1bmN0aW9uYWxpdHlfc3RvcmFnZSUyMiUzQSUyMmRlbmllZCUyMiUyQyUyMnBlcnNvbmFsaXphdGlvbl9zdG9yYWdlJTIyJTNBJTIyZGVuaWVkJTIyJTdEJTdE:1 [Report Only] Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'none'". Either the 'unsafe-inline' keyword, a hash ('sha256-fO0h6nSVSg6QGOtEkqzxNcpe9iJLgXxfCBJTJ4butWU='), or a nonce ('nonce-...') is required to enable inline execution.


Can you make sure all gitignores in the entire project hide everything sensitive? Double-check for me


1. while generating study materials, please show more information to the user i.e. what the agent is currently doing
2. can you split up @index.ts into a few component files to compartmentalize the code? make it intuitive and simple.

Can you refactor so that @extension/  is purely frontend and a @backend/  directory is purely backend?

@extension/  should be a chat interface, take in user input and use the backedn at @backend/  directory to interact with the AI.

@https://developers.cloudflare.com/workflows/ 
@https://developers.cloudflare.com/agents/ 


the best way to set up the file structure is to use startup commands found in documentation, not by creating each file separately

don't change the existing background folder, integrate agents seamlessly into it


For the code present, we get this error:
```
Cannot find module 'agents/protocol' or its corresponding type declarations.
```
How can I resolve this? If you propose a fix, please make it concise.

For the code present, we get this error:
```
Argument of type '"@cf/meta/llama-3.1-8b-instruct"' is not assignable to parameter of type 'keyof AiModels'.
```
How can I resolve this? If you propose a fix, please make it concise.

use Llama 3.3 on Cloudflare Workers AI @Web @Cloudflare 


For the code present, we get this error:
```
Argument of type '"@cf/meta/llama-3.1-8b-instruct"' is not assignable to parameter of type 'keyof AiModels'.
```
How can I resolve this? If you propose a fix, please make it concise.

use Llama 3.3 on Cloudflare Workers AI @Web @Cloudflare 


For the code present, we get this error:
```
Property 'exec' does not exist on type '<T = Record<string, string | number | boolean | null>>(strings: TemplateStringsArray, ...values: (string | number | boolean | null)[]) => T[]'.
```
How can I resolve this? If you propose a fix, please make it concise.


Skip to content

Cloudflare Docs

Search
⌘
K
Docs Directory
APIs
SDKs
Help
Log in
Select theme
Auto
Workers AI
Search sidebar...
Overview
Models
Agents ↗
Playground ↗
Changelog
REST API reference ↗ 
On this page
Overview
Playground
Usage
Parameters
Input
Output
API Schemas

Was this helpful?


Issue
Directory
Workers AI
Models

Copy page

Meta logo
llama-3.3-70b-instruct-fp8-fast
Text Generation • Meta
@cf/meta/llama-3.3-70b-instruct-fp8-fast
Llama 3.3 70B quantized to fp8 precision, optimized to be faster.

Model Info	
Context Window ↗	24,000 tokens
Terms and License	link ↗
Function calling ↗	Yes
Batch	Yes
Unit Pricing	$0.29 per M input tokens, $2.25 per M output tokens
Playground
Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

Launch the LLM Playground
Usage
Worker - Streaming
TypeScript
export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {

    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];

    const stream = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages,
      stream: true,
    });

    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;

Worker
TypeScript
export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {

    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages });

    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;

Python
Python
import os
import requests

ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")

prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)

curl
Terminal window
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for /v1/chat/completions and /v1/embeddings. For more details, refer to Configurations .
Parameters
* indicates a required field

Input
0 
prompt  required min 1
The input text prompt for the model to generate a response.

lora 
Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

response_format 
type 
json_schema
raw 
If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

stream 
If true, the response will be streamed back incrementally using SSE, Server Sent Events.

max_tokens  default 256
The maximum number of tokens to generate in the response.

temperature  default 0.6 min 0 max 5
Controls the randomness of the output; higher values produce more random results.

top_p  min 0.001 max 1
Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

top_k  min 1 max 50
Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

seed  min 1 max 9999999999
Random seed for reproducibility of the generation.

repetition_penalty  min 0 max 2
Penalty for repeated tokens; higher values discourage repetition.

frequency_penalty  min -2 max 2
Decreases the likelihood of the model repeating the same lines verbatim.

presence_penalty  min -2 max 2
Increases the likelihood of the model introducing new topics.

1 
messages  required
An array of message objects representing the conversation history.

items 
role  required
The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

content  required
The content of the message as a string.

functions 
items 
name  required
code  required
tools 
A list of tools available for the assistant to use.

items 
0 
name  required
The name of the tool. More descriptive the better.

description  required
A brief description of what the tool does.

parameters  required
Schema defining the parameters accepted by the tool.

type  required
The type of the parameters object (usually 'object').

required 
List of required parameter names.

items 
properties  required
Definitions of each parameter.

additionalProperties 
type  required
The data type of the parameter.

description  required
A description of the expected parameter.

1 
type  required
Specifies the type of tool (e.g., 'function').

function  required
Details of the function tool.

name  required
The name of the function.

description  required
A brief description of what the function does.

parameters  required
Schema defining the parameters accepted by the function.

type  required
The type of the parameters object (usually 'object').

required 
List of required parameter names.

items 
properties  required
Definitions of each parameter.

additionalProperties 
type  required
The data type of the parameter.

description  required
A description of the expected parameter.

response_format 
type 
json_schema
raw 
If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

stream 
If true, the response will be streamed back incrementally using SSE, Server Sent Events.

max_tokens  default 256
The maximum number of tokens to generate in the response.

temperature  default 0.6 min 0 max 5
Controls the randomness of the output; higher values produce more random results.

top_p  min 0.001 max 1
Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

top_k  min 1 max 50
Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

seed  min 1 max 9999999999
Random seed for reproducibility of the generation.

repetition_penalty  min 0 max 2
Penalty for repeated tokens; higher values discourage repetition.

frequency_penalty  min -2 max 2
Decreases the likelihood of the model repeating the same lines verbatim.

presence_penalty  min -2 max 2
Increases the likelihood of the model introducing new topics.

2 
requests 
items 
external_reference 
User-supplied reference. This field will be present in the response as well it can be used to reference the request and response. It's NOT validated to be unique.

prompt  min 1
Prompt for the text generation model

stream 
If true, the response will be streamed back incrementally using SSE, Server Sent Events.

max_tokens  default 256
The maximum number of tokens to generate in the response.

temperature  default 0.6 min 0 max 5
Controls the randomness of the output; higher values produce more random results.

top_p  min 0 max 2
Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

seed  min 1 max 9999999999
Random seed for reproducibility of the generation.

repetition_penalty  min 0 max 2
Penalty for repeated tokens; higher values discourage repetition.

frequency_penalty  min 0 max 2
Decreases the likelihood of the model repeating the same lines verbatim.

presence_penalty  min 0 max 2
Increases the likelihood of the model introducing new topics.

response_format 
type 
json_schema
Output
0 
response  required
The generated text response from the model

usage 
Usage statistics for the inference request

prompt_tokens  0
Total number of tokens in input

completion_tokens  0
Total number of tokens in output

total_tokens  0
Total number of input and output tokens

tool_calls 
An array of tool calls requests made during the response generation

items 
arguments 
The arguments passed to be passed to the tool call request

name 
The name of the tool to be called

1 
2 
request_id 
The async request id that can be used to obtain the results.

API Schemas
The following schemas are based on JSON Schema

Input
Output
{
    "type": "object",
    "oneOf": [
        {
            "title": "Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Prompt",
            "properties": {
                "prompt": {
                    "type": "string",
                    "minLength": 1,
                    "description": "The input text prompt for the model to generate a response."
                },
                "lora": {
                    "type": "string",
                    "description": "Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model."
                },
                "response_format": {
                    "title": "JSON Mode",
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "json_object",
                                "json_schema"
                            ]
                        },
                        "json_schema": {}
                    }
                },
                "raw": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, a chat template is not applied and you must adhere to the specific model's expected formatting."
                },
                "stream": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, the response will be streamed back incrementally using SSE, Server Sent Events."
                },
                "max_tokens": {
                    "type": "integer",
                    "default": 256,
                    "description": "The maximum number of tokens to generate in the response."
                },
                "temperature": {
                    "type": "number",
                    "default": 0.6,
                    "minimum": 0,
                    "maximum": 5,
                    "description": "Controls the randomness of the output; higher values produce more random results."
                },
                "top_p": {
                    "type": "number",
                    "minimum": 0.001,
                    "maximum": 1,
                    "description": "Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses."
                },
                "top_k": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "description": "Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises."
                },
                "seed": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 9999999999,
                    "description": "Random seed for reproducibility of the generation."
                },
                "repetition_penalty": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 2,
                    "description": "Penalty for repeated tokens; higher values discourage repetition."
                },
                "frequency_penalty": {
                    "type": "number",
                    "minimum": -2,
                    "maximum": 2,
                    "description": "Decreases the likelihood of the model repeating the same lines verbatim."
                },
                "presence_penalty": {
                    "type": "number",
                    "minimum": -2,
                    "maximum": 2,
                    "description": "Increases the likelihood of the model introducing new topics."
                }
            },
            "required": [
                "prompt"
            ]
        },
        {
            "title": "Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Messages",
            "properties": {
                "messages": {
                    "type": "array",
                    "description": "An array of message objects representing the conversation history.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "role": {
                                "type": "string",
                                "description": "The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool')."
                            },
                            "content": {
                                "type": "string",
                                "description": "The content of the message as a string."
                            }
                        },
                        "required": [
                            "role",
                            "content"
                        ]
                    }
                },
                "functions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "code": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "name",
                            "code"
                        ]
                    }
                },
                "tools": {
                    "type": "array",
                    "description": "A list of tools available for the assistant to use.",
                    "items": {
                        "type": "object",
                        "oneOf": [
                            {
                                "properties": {
                                    "name": {
                                        "type": "string",
                                        "description": "The name of the tool. More descriptive the better."
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "A brief description of what the tool does."
                                    },
                                    "parameters": {
                                        "type": "object",
                                        "description": "Schema defining the parameters accepted by the tool.",
                                        "properties": {
                                            "type": {
                                                "type": "string",
                                                "description": "The type of the parameters object (usually 'object')."
                                            },
                                            "required": {
                                                "type": "array",
                                                "description": "List of required parameter names.",
                                                "items": {
                                                    "type": "string"
                                                }
                                            },
                                            "properties": {
                                                "type": "object",
                                                "description": "Definitions of each parameter.",
                                                "additionalProperties": {
                                                    "type": "object",
                                                    "properties": {
                                                        "type": {
                                                            "type": "string",
                                                            "description": "The data type of the parameter."
                                                        },
                                                        "description": {
                                                            "type": "string",
                                                            "description": "A description of the expected parameter."
                                                        }
                                                    },
                                                    "required": [
                                                        "type",
                                                        "description"
                                                    ]
                                                }
                                            }
                                        },
                                        "required": [
                                            "type",
                                            "properties"
                                        ]
                                    }
                                },
                                "required": [
                                    "name",
                                    "description",
                                    "parameters"
                                ]
                            },
                            {
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "description": "Specifies the type of tool (e.g., 'function')."
                                    },
                                    "function": {
                                        "type": "object",
                                        "description": "Details of the function tool.",
                                        "properties": {
                                            "name": {
                                                "type": "string",
                                                "description": "The name of the function."
                                            },
                                            "description": {
                                                "type": "string",
                                                "description": "A brief description of what the function does."
                                            },
                                            "parameters": {
                                                "type": "object",
                                                "description": "Schema defining the parameters accepted by the function.",
                                                "properties": {
                                                    "type": {
                                                        "type": "string",
                                                        "description": "The type of the parameters object (usually 'object')."
                                                    },
                                                    "required": {
                                                        "type": "array",
                                                        "description": "List of required parameter names.",
                                                        "items": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "properties": {
                                                        "type": "object",
                                                        "description": "Definitions of each parameter.",
                                                        "additionalProperties": {
                                                            "type": "object",
                                                            "properties": {
                                                                "type": {
                                                                    "type": "string",
                                                                    "description": "The data type of the parameter."
                                                                },
                                                                "description": {
                                                                    "type": "string",
                                                                    "description": "A description of the expected parameter."
                                                                }
                                                            },
                                                            "required": [
                                                                "type",
                                                                "description"
                                                            ]
                                                        }
                                                    }
                                                },
                                                "required": [
                                                    "type",
                                                    "properties"
                                                ]
                                            }
                                        },
                                        "required": [
                                            "name",
                                            "description",
                                            "parameters"
                                        ]
                                    }
                                },
                                "required": [
                                    "type",
                                    "function"
                                ]
                            }
                        ]
                    }
                },
                "response_format": {
                    "title": "JSON Mode",
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "json_object",
                                "json_schema"
                            ]
                        },
                        "json_schema": {}
                    }
                },
                "raw": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, a chat template is not applied and you must adhere to the specific model's expected formatting."
                },
                "stream": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, the response will be streamed back incrementally using SSE, Server Sent Events."
                },
                "max_tokens": {
                    "type": "integer",
                    "default": 256,
                    "description": "The maximum number of tokens to generate in the response."
                },
                "temperature": {
                    "type": "number",
                    "default": 0.6,
                    "minimum": 0,
                    "maximum": 5,
                    "description": "Controls the randomness of the output; higher values produce more random results."
                },
                "top_p": {
                    "type": "number",
                    "minimum": 0.001,
                    "maximum": 1,
                    "description": "Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses."
                },
                "top_k": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "description": "Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises."
                },
                "seed": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 9999999999,
                    "description": "Random seed for reproducibility of the generation."
                },
                "repetition_penalty": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 2,
                    "description": "Penalty for repeated tokens; higher values discourage repetition."
                },
                "frequency_penalty": {
                    "type": "number",
                    "minimum": -2,
                    "maximum": 2,
                    "description": "Decreases the likelihood of the model repeating the same lines verbatim."
                },
                "presence_penalty": {
                    "type": "number",
                    "minimum": -2,
                    "maximum": 2,
                    "description": "Increases the likelihood of the model introducing new topics."
                }
            },
            "required": [
                "messages"
            ]
        },
        {
            "title": "Async Batch",
            "type": "object",
            "properties": {
                "requests": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "external_reference": {
                                "type": "string",
                                "description": "User-supplied reference. This field will be present in the response as well it can be used to reference the request and response. It's NOT validated to be unique."
                            },
                            "prompt": {
                                "type": "string",
                                "minLength": 1,
                                "description": "Prompt for the text generation model"
                            },
                            "stream": {
                                "type": "boolean",
                                "default": false,
                                "description": "If true, the response will be streamed back incrementally using SSE, Server Sent Events."
                            },
                            "max_tokens": {
                                "type": "integer",
                                "default": 256,
                                "description": "The maximum number of tokens to generate in the response."
                            },
                            "temperature": {
                                "type": "number",
                                "default": 0.6,
                                "minimum": 0,
                                "maximum": 5,
                                "description": "Controls the randomness of the output; higher values produce more random results."
                            },
                            "top_p": {
                                "type": "number",
                                "minimum": 0,
                                "maximum": 2,
                                "description": "Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses."
                            },
                            "seed": {
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 9999999999,
                                "description": "Random seed for reproducibility of the generation."
                            },
                            "repetition_penalty": {
                                "type": "number",
                                "minimum": 0,
                                "maximum": 2,
                                "description": "Penalty for repeated tokens; higher values discourage repetition."
                            },
                            "frequency_penalty": {
                                "type": "number",
                                "minimum": 0,
                                "maximum": 2,
                                "description": "Decreases the likelihood of the model repeating the same lines verbatim."
                            },
                            "presence_penalty": {
                                "type": "number",
                                "minimum": 0,
                                "maximum": 2,
                                "description": "Increases the likelihood of the model introducing new topics."
                            },
                            "response_format": {
                                "title": "JSON Mode",
                                "type": "object",
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "json_object",
                                            "json_schema"
                                        ]
                                    },
                                    "json_schema": {}
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
}

Previous
Dashboard
Next
Workers Bindings
Resources
API
New to Cloudflare?
Directory
Sponsorships
Open Source
Support
Help Center
System Status
Compliance
GDPR
Company
cloudflare.com
Our team
Careers
Tools
Cloudflare Radar
Speed Test
Is BGP Safe Yet?
RPKI Toolkit
Certificate Transparency
Community
X
Discord
YouTube
GitHub
© 2025 Cloudflare, Inc.
Privacy Policy
Terms of Use
Report Security Issues
Trademark
privacy optionsYour Privacy Choices




Doest his file @index.ts align with the  documentation?

@https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/ 


Error: Backend error: Internal Server Error




Fix the history log.

- pressing historical chats should actually go to that chat
- opening a new chat should inject the current page's content into context


This is what clarvis told me:
```
what's on the page?

07:27 PM

A

data: {"response":"","tool_calls":[],"p":"abdefghijklmnoprstuvxyz12"}

data: {"response":"You","tool_calls":[],"p":"abdefghijklmnoprstuvxyz1234567890abdefghijklmnopr"}

data: {"response":"'re looking","tool_calls":[],"p":"abdefgh"}

data: {"response":" at a webpage","tool_calls":[],"p":"abdefghijklm"}

data: {"response":", but","tool_calls":[],"p":"abdefghijklmnoprstuvxyz12345"}

data: {"response":" I don","tool_calls":[],"p":"abdefghijklmnoprstuvxyz1234567890abdefghij"}

data: {"response":"'t have the","tool_calls":[],"p":"abdefghij"}

data: {"response":" specifics","tool_calls":[],"p":"abdefghijklmnoprstuvxyz12345678"}

data: {"response":" of","tool_calls":[],"p":"abdefghijklm"}

data: {"response":" what's on","tool_calls":[],"p":"abdefghijklmn"}

data: {"response":" it. Can","tool_calls":[],"p":"abdefghijklmnoprstuvxyz12"}

data: {"response":" you please","tool_calls":[],"p":"abdefghijklmnoprstuvxyz1234567890abdefghijklmnoprs"}

data: {"response":" tell me the","tool_calls":[],"p":"abdefghijklmnoprstuvxyz123"}

data: {"response":" URL or","tool_calls":[],"p":"abdefghijklmno"}

data: {"response":" describe","tool_calls":[],"p":"abdefg"}

data: {"response":" the content","tool_calls":[],"p":"abdefghijklmnoprstuvxyz1234567890ab"}

data: {"response":" you're seeing","tool_calls":[],"p":"abdefghijklmnoprstuvxyz1234567890abdefghijklmnopr"}

data: {"response":"? That","tool_calls":[],"p":"abdefghijklmnoprstuvxyz123"}

data: {"response":" way, I","tool_calls":[],"p":"abdefghijklmnoprstuvxyz1234"}

data: {"response":" can provide","tool_calls":[],"p":"abdefghijklmnoprstuvxyz123456789"}

data: {"response":" more tailored insights","tool_calls":[],"p":"abdefghijklmnoprstuvxyz1234567890abdefghijklmn"}

data: {"response":" and help","tool_calls":[],"p":"abdefghijklmnoprstuvxyz123456"}

data: {"response":".","tool_calls":[],"p":"abdefghi"}

data: {"response":"","tool_calls":[],"p":"abdefghijklmn"}

data: {"tool_calls":[],"p":"abdefghijklmnoprstuvxyz1234567890abdefghi"}

data: {"response":"","usage":{"prompt_tokens":169,"completion_tokens":48,"total_tokens":217}}

data: [DONE]
```


how do I give clarvis access to see what's on the webpage?

@backend/ @extension/ @https://agents.cloudflare.com/ 
@https://developers.cloudflare.com/workflows/get-started/guide/ 


@extension/ why does the text/content on the tab expand beyond the margins? this breaks the view of the popup, can you fix this

the content still goes wider than the available space in the popup. @popup/ 

> vite build

vite v7.1.12 building for production...
✓ 7 modules transformed.
✗ Build failed in 68ms
error during build:
[@tailwindcss/vite:generate:build] Cannot apply unknown utility class `overflow-wrap-anywhere`
file: /Users/sol/dev/cloudflare-project/clarvis-extension/extension/src/styles.css
    at onInvalidCandidate (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:21:1511)
    at Ae (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:16:36011)
    at file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:21:355
    at hr (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:3:1718)
    at I (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:3:1377)
    at xe (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:21:172)
    at zi (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:38:294)
    at async Ba (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:38:631)
    at async Hu (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/tailwindcss/dist/chunk-OQ4W6SLL.mjs:38:1406)
    at async nu (file:///Users/sol/dev/cloudflare-project/clarvis-extension/extension/node_modules/@tailwindcss/node/dist/index.mjs:10:3433)
sol@sol extension % 


