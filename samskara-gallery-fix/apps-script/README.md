# Deploy the Creative Wall gallery API

The supplied script returns only approved entries, but its original `doPost` did not save uploaded image URLs. The updated `Code.gs` keeps the existing `Registration` and `Submissions` tabs, stores `imageUrl` for each creative submission, and continues to return only rows whose `Status` is `approved`.

1. Open the Apps Script project attached to the spreadsheet containing those tabs. Keep the existing spreadsheet binding and replace the project code with `Code.gs`.
2. Save the script. Existing `Submissions` columns remain in place; `imageUrl` is added to the end if it is missing, preserving `Status` as column 7.
3. In **Deploy → Manage deployments**, edit the current web app deployment and publish a **New version**. Keep it running as the spreadsheet owner and available to anyone, so the existing `/exec` URL remains valid.
4. Set a rotated `IMGBB_API_KEY` in the website host's server environment. Set `GALLERY_API_URL` only if the Apps Script `/exec` URL differs from the existing one, then redeploy the website.
5. Submit a new image. It will be stored with `Status` set to `pending`; change that row's `Status` to `approved` in `Submissions` for it to appear in the gallery.

Older rows have no image URL because the previous script discarded it. Add their image URLs manually if those images are still available. The old ImgBB key was embedded in client code, so rotate it before launch and use the replacement only as the server-side `IMGBB_API_KEY` value.
