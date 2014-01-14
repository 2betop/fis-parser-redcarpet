#!/usr/bin/env ruby
require 'redcarpet'
require 'pygments'

# create a custom renderer that allows highlighting of code blocks
class HTMLwithPygments < Redcarpet::Render::HTML
  def block_code(code, language)
    Pygments.highlight(code, :lexer => language)
  end
end

source = ""

$stdin.each_line do |line|
    source += line
end

markdown_renderer = Redcarpet::Markdown.new(HTMLwithPygments.new(:with_toc_data => true, :hard_wrap => true, :xhtml=>true), :fenced_code_blocks => true, :no_intra_emphasis => true, :tables => true, :autolink => true, :strikethrough => true, :space_after_headers => true)

puts markdown_renderer.render(source)

if ARGV.first
    converter = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
    toc = converter.render(source)
    toc = toc.gsub(/<ul>/, '<ul class="nav">')
    puts "<!--separator-->\n#{toc}\n"
end
