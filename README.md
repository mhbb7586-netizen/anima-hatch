# Anima Hatch

Build a mobile-first web application called "ANIMA HATCH".

This is NOT a SaaS dashboard.

It should feel like an indie pixel RPG game.

The service gamifies the Johari Window personality theory.

Flow:

1. User selects their own strengths by swiping cards.

2. Three friends answer the same way.

3. Compare self vs others.

4. Hatch an egg.

5. Unlock one RPG class.

The whole service should feel like progressing through a fantasy game rather than filling out a survey.

🎨 Design System

Style:
- Retro 2D pixel art
- Pixel RPG
- Fantasy magic world
- Mobile only (390x844)

Background
- #1A1035
- #2A1B4A
- animated stars
- purple fog
- pixel particles

DO NOT USE
- rounded corners
- glassmorphism
- neumorphism
- pastel colors
- white cards
- soft shadows
- modern SaaS style

Everything should have
pixel borders,
pixel buttons,
pixel icons,
pixel frames.

UI Components

Create reusable components.

PixelButton
- primary
- danger
- success
- disabled

PixelCard

PixelDialog

PixelProgressBar

PixelBottomNavigation

PixelInput

PixelTag

PixelModal

PixelStatBar

PixelWindow

PixelToast

Pixel Border Rules

Every UI element uses
8-bit pixel borders.

No border radius.

Buttons use
pixel bevel.

Pressed state:
move down 2px.

Hover:
slightly brighter.

Use thick outlines.

Typography

Use Korean.

Pixel style fonts.

Examples:

DungGeunMo
Galmuri

Typography

H1

H2

Body

Caption

Button

Color System

Primary Purple
#A855F7

Background
#1A1035

Wisdom
#A855F7

Courage
#F97316

Humanity
#4ADE80

Justice
#FBBF24

Temperance
#93C5FD

Creativity
#F472B6

Character Rules

I will upload
a character sheet.

Never redesign the characters.

Always use them consistently.

Result screen must display
the exact character style.

Characters are
pixel sprites.

Icon Rules

Every icon must be pixel art.

Examples

Sword
Book
Shield
Hourglass
Star
Potion
Leaf
Fire
Magic Crystal

Do NOT use outline icons.

Do NOT use Heroicons.

Do NOT use Lucide icons.

Everything should look like
old RPG inventory icons.

Swipe Card Rules

Cards have

Pixel border

No rounded corners

Top tag

Large keyword

Pixel item illustration

Small description

Cards stack behind each other

Swipe left = reject

Swipe right = choose

Buttons

Left

Red

X

Right

Green

O

No middle button.

No text.

Only icons.

Result Screen

Character appears above
a glowing magic circle.

Use animated particles.

Use segmented RPG stat bars.

Replace Johari Window with

열린 스탯

숨겨진 스탯

보이지 않는 스탯

미지의 스탯

Each panel has
its own pixel frame.

Navigation

Bottom Navigation

Home

Result

Characters

My Page

Every icon
is pixel art.

Current page glows.

Animations

Very subtle.

Floating egg

Sparkles

Magic circle rotation

Torch flame

Button press

Egg cracking

Character hatch

Nothing should feel modern.

Everything should feel like
an old JRPG.

Important

Design first.

Consistency is more important than creativity.

Every page should feel like
one game.

Reuse components.

Maintain the same pixel style everywhere.

화면 플로우

/
Landing

/profile
닉네임 입력

/tutorial
강점 선택 안내

/swipe
사용자 스와이프

/complete
선택 완료

/invite
친구 초대

/waiting
응답 대기

/friend
친구 랜딩

/friend/tutorial

/friend/swipe

/friend/complete

/hatch
부화 연출

/result
결과

/character
캐릭터 도감

/mypage
마이페이지

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://anima-hatch.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f28f5660-9e0e-4f21-b232-765196bfc303).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
