---
title: Getting the Browser Default Language in PHP
date: 2008-10-18
slug: getting-browser-default-language-in-php
category: Computers
summary: If you do much international work, getting the users default language isn't as simple as it may appear. Using PHP and a few regular expressions you can quickly parse what the users browser says is its preferred language.
tags:
  - Linux
redirect_from:
  - /2008/10/getting-browser-default-language-php.html
---



If you’re doing international (i18n or Iñtërnâtiônàlizætiøn) work (or
just want to make your site available in several languages), you’ll
likely need to determine the users default language in your PHP code to
determine which language to serve up. Searching the web yields one
common code piece frequently; unfortunately as you’ll soon see it may
not give you the results you need as it ignores parts of the HTTP spec
which may or may not be critical to the accuracy of the results.

HTTP Language Headers
---------------------

The interchange between browser and server transfers information about
the client and its capabilities in headers — user agent, what it will
accept, and (what we’re interested in) language. The browser sends
language information in a header called `HTTP_ACCEPT_LANGUAGE`, which
looks something like this:

     es,en-us;q=0.3,de;q=0.1

Those values state the browser accepts Spanish (es), US English (en-us),
and German (de). Obviously, most browsers don’t send so many
possibilities, but you get the idea. Most of the code you can find to
determine default language simply searches the header for the first
2-letter language code and returns the first it finds. But looking at
the example, you’ll note some additional information `q=0.3` — what’s
that?

HTTP Header Q-Values for HTTP_ACCEPT_LANGUAGE
-----------------------------------------------

As part of the HTTP spec, those are Q-Values, and must be a number
between 0 and 1 (if no number appears, you can assume the value as 1).
Q-Values provide not only information to what a browser *supports*, but
what it *prefers*. In the previous example, `es` has no q-value, so it’s
1.0, while `en-us` is 0.3 and `de` is 0.1 so that means this client can
handle Spanish, US English, or German — but *prefers* Spanish if it’s
available. If it’s not, the server is free to send any of the other
supported choices.

Now you see the problem — if you only search the `HTTP_ACCEPT_LANGUAGE`
header for a match and ignore the q-value, you have no way to determine
what language the client *prefers* — you’ll only get a match for
support. Or at worse, if a q-value is 0 (meaning no support at all),
you’ll get a language the client specifically tells you *not* to send.
Why simple reg-ex solutions work becomes obvious after examining some
actual `HTTP_ACCEPT_LANGUAGE` headers sent by popular browsers:

-   `en-us,en;q=0.5` (Mozilla)
-   `en-US,en;q=0.9` (Opera)
-   `en-us` (Internet Explorer)
-   `en` (Lynx)

In those cases a simple string match works, even if q-values are
ignored. But if the actual `HTTP_ACCEPT_LANGUAGE` HTTP header contains
multiple languages with differing q-values like `"en,de;q=0.9"` (a
person whose primary language is English, but knows German) simple
string searches fail spectacularly. Obviously, we must consider q-values
if our results are to be correct.

Algorithm
---------

The solution is simple. Break apart the string into it’s language
components (they’re separated by commas), and then pick the one with the
highest q-value to use (assume any language lacking q-values have a
value of 1.0). In our example, we’ll split the string and get the
following array back:

-   `es` — Spanish, assume q-value = 1.0
-   `en-us;q=0.3` — US English, with q-value of 0.3
-   `de;q=0.1` — German, with q-value of 0.1

Now with the languages identified,use regular expressions to extract the
q-value, if it exists. Once all the q-values are assigned, select the
one with the highest q-value, if it exists. If multiple languages have
the same q-value, it’s safe to use any of them equally.

The Code
--------

The following is
[BSD-Licensed](/downloads/license-bsd.txt) PHP
code.

<pre class="code notranslate">
#########################################################
# Copyright © 2008 Darrin Yeager                        #
# https://www.dyeager.org/                               #
# Licensed under BSD license.                           #
#   https://www.dyeager.org/downloads/license-bsd.txt    #
#########################################################

function getDefaultLanguage() {
   if (isset($_SERVER["HTTP_ACCEPT_LANGUAGE"]))
      return parseDefaultLanguage($_SERVER["HTTP_ACCEPT_LANGUAGE"]);
   else
      return parseDefaultLanguage(NULL);
   }

function parseDefaultLanguage($http_accept, $deflang = "en") {
   if(isset($http_accept) && strlen($http_accept) > 1)  {
      # Split possible languages into array
      $x = explode(",",$http_accept);
      foreach ($x as $val) {
         #check for q-value and create associative array. No q-value means 1 by rule
         if(preg_match("/(.*);q=([0-1]{0,1}.\d{0,4})/i",$val,$matches))
            $lang[$matches[1]] = (float)$matches[2];
         else
            $lang[$val] = 1.0;
      }

      #return default language (highest q-value)
      $qval = 0.0;
      foreach ($lang as $key => $value) {
         if ($value > $qval) {
            $qval = (float)$value;
            $deflang = $key;
         }
      }
   }
   return strtolower($deflang);
}
</pre>

Then in your code, just call `getDefaultLanguage()` and you’ll get a
string back with the highest q-value language sent by the browser in the
`HTTP_ACCEPT_LANGUAGE` header.

Caveats
-------

First, *be sure* to use UTF-8 as your character encoding. If you’re not
using UTF-8 right now, convert all your documents to it — you’ll be glad
you did later.

Second, if you’re sending different language-specific content at the
same URL, be sure to send the appropriate Vary header. If you don’t,
intermediate proxy caches might be confused and serve the wrong language
to some people. To do that, just use the following first in your PHP
code: `header("Vary: Accept-Language")`. But be warned Internet Explorer
has some bugs with the Vary header you should be aware of.

So what?
--------

What’s this good for? In a future article, we’ll demonstrate how to use
this method to get instant translations of your web pages into many
different languages — automatically.

References
----------

-   [HTTP 1.1 Specification](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4)
    (Section 14.4 Accept-Language header)
-   [Language Tags in HTML and XHTML (w3c)](http://www.w3.org/International/articles/language-tags/)
-   [RFC 4646](http://www.rfc-editor.org/rfc/rfc4646.txt)
-   [List of Language Tags](http://www.iana.org/assignments/language-subtag-registry)

**UPDATE July 2012:** Some discussion over 
[software licensing](http://www.codinghorror.com/blog/2007/04/pick-a-license-any-license.html).
I'm not a lawyer, but some say public domain isn't valid everywhere,
others have a specific favorite license (the GPL vs BSD debate). I don't
want to engage in any of those debates, so to be simple and clear on
this, use any of the following:

-   BSD (3-clause)
-   GNU GPL V2
-   GNU GPL V3
-   GNU Affero GPL V3
-   MIT/X11

**UPDATE November 2012** — Nope, that didn’t clear it up. I’m *stunned*
by the hate-mail I’ve received over this piece. I (like many
programmers) write code to fix problems *I* face, and think, hey, if
I’ve faced this problem, maybe others have too, so why not post it and
help others avoid re-inventing the wheel?

I’ve done this before with my [Kate and Markdown syntax highlighting filter]({% post_url 2008-06-13-markdown-color-syntax-highlighting-kate %}),
and the KDE project picked that up so everyone could benefit.

Sadly, in the future I think I’ll refrain from helping other people by
posting code. I don’t even write much PHP code anymore, but leave the
page here to help others who do.

But as usual, a few ass-hats ruin it for everyone else.

It appears many people are confused over copyright and how it works. I’m
no lawyer, but consider what Jeff Atwood says in 
[pick a license, any license](http://www.codinghorror.com/blog/2007/04/pick-a-license-any-license.html)
as he considers what posting code without any license means:

> Because I did not explicitly indicate a license, I declared an
> implicit copyright without explaining how others could use my code.
> Since the code is unlicensed, I could theoretically assert copyright
> at any time and demand that people stop using my code. Experienced
> developers won’t touch unlicensed code because *they have no legal
> right to use it*. That’s ironic, considering the whole reason I posted
> the code in the first place was so other developers could benefit from
> that code. I could have easily avoided this unfortunate situation if I
> had done the right thing and **included a software license with my
> code**.

[Jeff founded stackoverflow.com](http://www.codinghorror.com/blog/2004/02/about-me.html),
so even if you don’t know who he is you’ve probably used something he
developed.

Why the hate-mail? If you don’t like the code, or think it’s crap, don’t
use it. It worked for me, if it doesn’t for you, write something better.

This page has become quite popular, so it’s obviously a problem facing
PHP programmers. I’m glad I could help those people.

I just don’t think I’ll do it again — if this page suddenly goes 410,
you’ll know why.

<pre class="code notranslate">
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

The PHP code on the web page:
dyeager.org/blog/2008/10/getting-browser-default-language-php.html
Titled "Getting the Browser Default Language in PHP"
can be used under any of the following licenses:

BSD (3-clause)
GNU GPL V2
GNU GPL V3
GNU Affero GPL V3
MIT/X11

-----BEGIN PGP SIGNATURE-----
Version: GnuPG v2.0.14 (GNU/Linux)

iQIcBAEBCAAGBQJQFYlhAAoJEBa2wjrT9ZFs5xEP/0qSc/QHu5EVf+4DqOzT9MZP
xwWp3c2JsEogD2HGw0CRxjLyE3ljSE8sHWUwX8G55l5Xm+8ZMKcrZxOj1ikNv6zt
LMLkcF1ggTWTVYw/pdY/kAlJkbYWvmCar6ELxuAPXysC7zTMmlzPOJsn23v/ZVpK
xJsFB1J3s0Q2GzFj0rhXVljz7JXQX57AdZSuPY0U+N+yKxEOrmgFm2QoKdCQs5nV
nqmMPPsePMQqxkWfhoQ9dlrkF5KeW/yvA/9pMFgN6++eCval0pPuE+mJeuKmVWBO
8pNaTP0N4z+MOyn/Pbg2oJZ8yCUtCLWD3KvbE1ngDzTbJpRtRJfZ/CbOhmeW2+Rq
ibb/VzGElef0UO4tJD2XTirOFZiXkipuFIFEXEDU+6iVpdzFWtfpJxdd3uJrwL3N
7J55G0xwkMfZhqkPvbEl1jerwfK4VyS57MCUkNQswF3qWYhLcE+TxRhwdM5e0k4F
4BMYzLuER7izbVw0/qLm5qw6WEWYMgOutueR/wQq02jCftZilSQJXJkrKPIKcZFC
ev+sL811AoPOl3nD5vqCxAUO114LyHMdqcvYgC45NLnevu/kmU2r+8f3f1/2CQYl
PHzEKxiiJz8DbV6sBirWVInjmRgkeuZgsbxV18XGQIC+vs6t6Vi3CX7dKZX7dQz6
sQTzzOuJ13qLf2kNAWF+
=MD+Z
-----END PGP SIGNATURE-----
</pre>
