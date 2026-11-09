-- Supabase > SQL Editor deer buten ni ajilluulna

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

create table movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'film' check (type in ('film','series')),
  year int,
  director text,
  runtime int,
  genre text,
  rating numeric(2,1) default 0,
  price int default 0,
  synopsis text,
  poster_url text,
  backdrop_url text,
  trailer_url text,
  gallery text[] default '{}',
  story_text text,
  acting_text text,
  cinematography_text text,
  impact_text text,
  easter_eggs text,
  recommendation text,
  created_at timestamptz default now()
);

create table genres (
  id serial primary key,
  name text unique not null
);

create table movie_genres (            -- N-M: movies <-> genres
  movie_id uuid references movies(id) on delete cascade,
  genre_id int references genres(id) on delete cascade,
  primary key (movie_id, genre_id)
);

create table cast_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text
);

create table movie_cast (              -- N-M: movies <-> cast_members
  movie_id uuid references movies(id) on delete cascade,
  cast_id uuid references cast_members(id) on delete cascade,
  role_name text,
  primary key (movie_id, cast_id)
);

create table reviews (                 -- 1-N: movie -> reviews, user -> reviews
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references movies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz default now()
);

create table orders (                  -- tulburiin heseg (daraagiin shat)
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id uuid not null references movies(id),
  amount int not null,
  status text not null default 'pending' check (status in ('pending','paid','cancelled')),
  created_at timestamptz default now()
);

-- Burtguulehed profile automataar uusgene
create function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, email) values (new.id, new.email);
  return new;
end; $$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

create function is_admin() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer;

-- RLS
alter table profiles enable row level security;
alter table movies enable row level security;
alter table genres enable row level security;
alter table movie_genres enable row level security;
alter table cast_members enable row level security;
alter table movie_cast enable row level security;
alter table reviews enable row level security;
alter table orders enable row level security;

create policy "own profile" on profiles for select using (id = auth.uid() or is_admin());

create policy "public read" on movies for select using (true);
create policy "admin write" on movies for all using (is_admin()) with check (is_admin());

create policy "public read" on genres for select using (true);
create policy "admin write" on genres for all using (is_admin()) with check (is_admin());
create policy "public read" on movie_genres for select using (true);
create policy "admin write" on movie_genres for all using (is_admin()) with check (is_admin());
create policy "public read" on cast_members for select using (true);
create policy "admin write" on cast_members for all using (is_admin()) with check (is_admin());
create policy "public read" on movie_cast for select using (true);
create policy "admin write" on movie_cast for all using (is_admin()) with check (is_admin());

create policy "public read" on reviews for select using (true);
create policy "insert own" on reviews for insert with check (user_id = auth.uid());
create policy "delete own" on reviews for delete using (user_id = auth.uid() or is_admin());

create policy "own orders" on orders for select using (user_id = auth.uid() or is_admin());
create policy "create own order" on orders for insert with check (user_id = auth.uid());

-- Storage bucket: poster, backdrop zurag
insert into storage.buckets (id, name, public) values ('posters', 'posters', true);
create policy "public view posters" on storage.objects for select using (bucket_id = 'posters');
create policy "admin upload posters" on storage.objects for insert with check (bucket_id = 'posters' and is_admin());

-- Jishee data (zurgiig daraa n Storage-oos linkleer solino)
insert into movies (title, type, year, director, runtime, genre, rating, synopsis, story_text, acting_text, cinematography_text, impact_text, easter_eggs, recommendation)
values (
  'Coraline', 'film', 2009, 'Henry Selick', 100, 'Animation / Horror', 4.7,
  'While exploring her new home, a girl named Coraline discovers a secret door, behind which lies an alternate world that closely mirrors her own but, in many ways, is better.',
  'Originally marketed to children, Coraline pushes the boundaries of a kids movie with whimsy balanced by dread.',
  'Dakota Fanning and Teri Hatcher give a layered voice performance.',
  'Handcrafted stop-motion sets, textures and lighting give the film a tactile eeriness.',
  'A turning point for LAIKA and a big influence on Gen Z artists and cosplayers.',
  'The Other Mother needle-like hands and the opening scene hint at lifeless shells.',
  'Watch it with a cake. The Welcome home cake is a symbol of sweetness hiding deception.'
);
