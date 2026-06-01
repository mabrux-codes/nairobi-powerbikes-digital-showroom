update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','application/pdf']
where id = 'test-ride-licenses';

update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif']
where id in ('bike-images','site-assets');

drop policy if exists "anyone upload license" on storage.objects;
create policy "anyone upload license"
on storage.objects for insert
with check (
  bucket_id = 'test-ride-licenses'
  and (storage.foldername(name))[1] = 'public'
);

revoke execute on function public.tg_set_updated_at() from public, anon, authenticated;