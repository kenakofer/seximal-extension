# seximal-extension
Browser extension to convert numbers to seximal (base 6). So "24.5" becomes "40.3" for example, because 4 * 6 + 0 * 1 + 3 * 1/6 == 24.5.

Why seximal? Check out <https://www.seximal.net/>

Right now its a proof-of-concept firefox extension. The JS is one basic file so I think porting to chrome will be trivial.

Currently, it finds (most) decimal numbers in a page, and replaces them with their seximal form. It also surrounds the number in `<abbr>` tags so that hovering it will reveal the original decimal. 

I couldn't find a good way to do the html insertion in one go, so right now there's an awkward substitution that happens to put the `<` and `>` characters in. I'm open to suggestions on how to make this better/faster.

TODO:
- Add chrome.
- Make more efficient.
- Fix rounding errors.
- Show the spelled out seximal name in the hovertext.
- It would be fun to also convert number names: "one hundred" ->  "two nif foursy four". Detecting and converting these could add lots of weight though.
- Distribute?
