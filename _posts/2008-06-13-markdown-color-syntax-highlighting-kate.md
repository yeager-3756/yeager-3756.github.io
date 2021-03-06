---
title: Markdown Color Syntax Highlighting in Kate
date: 2008-06-13
slug: markdown-color-syntax-highlighting-in-kate
category: Computers
summary: The Kate editor in Linux doesn't include color syntax highlights for Markdown files. Here's how to get it.
tags: 
  - Linux
  - Markdown
redirect_from:
  - /2008/06/markdown-color-syntax-highlighting-kate.html
  - /2008/06/kate-markdown-color-syntax-highlighting.html
  - /blog/2008/06/markdown-color-syntax-highlighting-kate.html
---



Most blog software allows the use of
[markdown](http://daringfireball.net/projects/markdown/) syntax on
posts. Markdown is a simple formatting language with an easy
[syntax](http://daringfireball.net/projects/markdown/syntax) which
easily transforms into HTML and other formats (PDF,RTF,LaTeX). It’s
designed to be a *simple* markup language (based on email formats) which
is quite easily read in it’s native form. Here’s what the creator of
Markdown says about the syntax:

> Readability, however, is emphasized above all else. A
> Markdown-formatted document should be publishable as-is, as plain
> text, without looking like it’s been marked up with tags or formatting
> instructions … the single biggest source of inspiration for Markdown’s
> syntax is the format of plain text email.
>
> To this end, Markdown’s syntax is comprised entirely of punctuation
> characters, which punctuation characters have been carefully chosen so
> as to look like what they mean. E.g., asterisks around a word actually
> look like \*emphasis\*. Markdown lists look like, well, lists. Even
> blockquotes look like quoted passages of text, assuming you’ve ever
> used email.

If you’re a blogger, you’ve likely already used Markdown. And if you’re
using Linux with the [Kate](http://kate-editor.org/) text editor, you’re
aware Kate does color-coding formatting for most major
languages/formats: C/C++, Java, Perl, Python, PHP and more.
Unfortunately, Kate doesn’t have built-in syntax color-coding for
Markdown; you need to create a custom XML file using Regular Expressions
to determine what to color code and how.

Installation is simple — copy the `markdown.xml` file to your
`~/.kde/share/apps/katepart/syntax/` directory. That’s it. Then, when
you open a file with extensions of `*.text, *.md, *.mmd`, you’ll get
Markdown-colored syntax editing!

**UPDATE November 2012** A comment indicated this will be included in
the [KDE repository](https://projects.kde.org/projects/kde/kde-baseapps/kate/repository/revisions/master/changes/part/syntax/data/markdown.xml).
Good news! I'd encourage anyone interested to work on the KDE version as
that will provide the widest distribution.

**Disclaimer**: This works for us, but regular expressions can be *very*
complex; if you use Markdown syntax differently you may find bugs.
Regular Expression edge conditions can be challenging, so please leave a
comment with a test case if the results aren’t quite what you expect.
