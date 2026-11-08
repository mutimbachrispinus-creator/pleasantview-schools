<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Pleasant View Schools</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            padding: 30px 20px;
            line-height: 1.5;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #8B1E2D 0%, #5B0E19 100%);
            color: #ffffff;
            padding: 32px 36px;
            border-bottom: 4px solid #D4AF37;
          }
          .header h1 {
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .header p {
            color: #fecdd3;
            font-size: 14px;
            max-width: 700px;
          }
          .info-bar {
            background: #fff1f2;
            padding: 14px 36px;
            border-bottom: 1px solid #fecdd3;
            font-size: 13px;
            color: #9f1239;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
          }
          .info-bar strong {
            color: #881337;
          }
          .table-wrapper {
            padding: 24px 36px 36px;
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            text-align: left;
            padding: 12px 16px;
            font-weight: 600;
            border-bottom: 2px solid #cbd5e1;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
          }
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
          }
          tr:hover td {
            background-color: #fdf2f4;
          }
          a {
            color: #8B1E2D;
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
            color: #be123c;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            background: #e2e8f0;
            color: #334155;
          }
          .badge-priority {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
          }
          .footer {
            padding: 18px 36px;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .footer a {
            color: #64748b;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pleasant View Schools — XML Sitemap</h1>
            <p>This is an XML sitemap generated for search engines (Google, Bing, Yahoo) to crawl and index pleasantviewschools.co.ke. Formatted with XSL styling for human browser preview.</p>
          </div>
          <div class="info-bar">
            <div>This sitemap indexes <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> canonical URLs.</div>
            <div>Domain: <strong>https://pleasantviewschools.co.ke</strong></div>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 50%;">Page URL</th>
                  <th style="width: 15%;">Priority</th>
                  <th style="width: 15%;">Change Frequency</th>
                  <th style="width: 20%;">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}" target="_blank" rel="noopener">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span class="badge badge-priority">
                        <xsl:choose>
                          <xsl:when test="sitemap:priority">
                            <xsl:value-of select="sitemap:priority"/>
                          </xsl:when>
                          <xsl:otherwise>0.8</xsl:otherwise>
                        </xsl:choose>
                      </span>
                    </td>
                    <td>
                      <span class="badge">
                        <xsl:choose>
                          <xsl:when test="sitemap:changefreq">
                            <xsl:value-of select="sitemap:changefreq"/>
                          </xsl:when>
                          <xsl:otherwise>weekly</xsl:otherwise>
                        </xsl:choose>
                      </span>
                    </td>
                    <td style="color: #64748b; font-size: 13px;">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
          <div class="footer">
            <span>Pleasant View Schools, Kiambu County • All Rights Reserved</span>
            <span><a href="https://pleasantviewschools.co.ke/">Back to Website →</a></span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
