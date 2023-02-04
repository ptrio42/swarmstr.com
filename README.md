# What is UseLessShit.co?

[UselessShit.co](https://uselessshit.co) is a fun project which purpose is to help spread the bitcoin adoption. 
One of the ways, in which it's trying to achieve this, is by allowing people to easily create unique, physical paper items
 (like bitcoin cards, bookmarks & stickers), which can be printed and handed out to friends, foes or complete strangers. 
 These items can also serve as gift cards, as they can be loaded with precious sats easily.

See for yourself how easy is to create your own graphics (no other tools required):

https://uselessshit.co/card-generator

## Features

* dedicated panel for creating bitcoin memes, personalized cards, bookmarks & stickers;
* lightning gifts & tip jars;
* simple & embeddable fiat2sats calculator;
* price receipts for your bitcoin purchases;
* list of bitcoin resources;
* nostr most common questions and answers;
* NIP-05 identifiers & lightning addresses;

### NOSTR Guide

If you'd like to help with gathering the Nostr resources, check out [this page](https://uselessshit.co/resources/nostr/) 
to see if there's anything missing (or something is outdated) and then create a pull request ;)

#### Contributing to the guide

All Nostr resources can be found in src/stubs/nostrResources.tsx file.

#### List of people involved in NOSTR

I'm currently maintaining a list of individuals involved in NOSTR projects at https://uselessshit.co/resources/nostr/#the-list

Check it out if you're looking for people to follow or you'd like to get involved in any of the existing projects.

If you're involved in a NOSTR project but you're not on the list, feel free to add yourself with a name, npub & website 🙂

##### Adding a name to the list

The list is a simple JSON in src/stubs/lists.tsx 

Each entry is in a list is organised as so:

```
    'PROJECT_NAME': [
        ['PERSON_NAME', 'PERSON_PUBKEY', 'PERSON_WEBSITE']
    ]
```

Each project can have multiple participants:

```
    'PROJECT_NAME': [
        ['PERSON1_NAME', 'PERSON1_PUBKEY', 'PERSON1_WEBSITE'],
        ['PERSON2_NAME', 'PERSON2_PUBKEY', 'PERSON2_WEBSITE'],
        ...
    ]
```

####### Adding new project

The entries on the list are displayed from top to bottom. Find a desirable place to add your entry.

For example, if you want to add a project between **nostr.console** and **Coracle**, locate it in the list file:

```
        'nostr.console': [
            ['vishalxl', 'npub1xg6sx67sj47lkf7vmgpdg5khca3musxfrgdvpq46dxpmy53c8zxqqy7kwr', 'https://github.com/vishalxl'],
            ['radixrat', 'npub14j0vqgqhq92lpl4nglcdwalwtlpcm50nvdfsjvzxxgmydnl4z60sdv04f4', 'https://github.com/radixrat/']
        ],
        'Coracle': [
            ['hodlbod', 'npub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn', 'https://github.com/staab/coracle']
        ]
```

And then add your project. For example:

```
        'nostr.console': [
            ['vishalxl', 'npub1xg6sx67sj47lkf7vmgpdg5khca3musxfrgdvpq46dxpmy53c8zxqqy7kwr', 'https://github.com/vishalxl'],
            ['radixrat', 'npub14j0vqgqhq92lpl4nglcdwalwtlpcm50nvdfsjvzxxgmydnl4z60sdv04f4', 'https://github.com/radixrat/']
        ],
        '': [
        'UseLessShit': [
            ['pitiunited', 'npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4', 'https://github.com/ptrio42/uselessshit.co']
        ],
        'Coracle': [
            ['hodlbod', 'npub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn', 'https://github.com/staab/coracle']
        ]
```

If you, or a person you'd like to add is involved in NOSTR but not in any particular project, you can add them to **Notable individuals**.

```
        'Notable individuals': [
            ['jack', 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m'],
            ['Snowden', 'npub1sn0wdenkukak0d9dfczzeacvhkrgz92ak56egt7vdgzn8pv2wfqqhrjdv9'],
            ['ODELL', 'npub1qny3tkh0acurzla8x3zy4nhrjz5zd8l9sy9jys09umwng00manysew95gx'],
            ['adamcurry', 'npub13ql75nq8rldygpkjke47y893akh5tglqtqzs6cspancaxktthsusvfqcg7'],
            ['lee', 'npub1taycl7qfuqk9dp0rhkse8lxhz3az9eanjug8j4ympwehvslnetxqkujg5y', 'https://github.com/leesalminen'],
            ['dave', 'npub1cldxy9f5shk0kxm90yk8nn3lum7wdmta3m6ndjcjr4aqcuewjt0sx3rps5', 'https://github.com/davestgermain'],
            ['LiranCohen', 'npub148jmlutaa49y5wl5mcll003ftj59v79vf7wuv3apcwpf75hx22vs7kk9ay', 'https://github.com/LiranCohen'],
            ['solobalbo', 'npub1x8dzy9xegwmdk2vy30l8u08caspcqq2yzncxehdsa6kvnte9pr3qnt8pg4'],
            ['PERSON_NAME', 'PERSON_PUBKEY', 'PERSON_WEBSITE']
        ],
```

Also, don't forget to add yourself to **List contributors** 😉

```
    'List contributors': [
        ['lukeonchain', 'npub138guayty78ch9k42n3uyz5ch3jcaa3u390647hwq0c83m2lypekq6wk36k'],
        ['pitiunited', 'npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4', 'https://github.com/ptrio42/uselessshit.co'],
        ['PERSON_NAME', 'PERSON_PUBKEY', 'PERSON_WEBSITE']
    ],
```
