# Rift

Rift is an open source communications facilitation framework built primarily in Elixir, Rust, and Node.js, and using MongoDB (migrating to ScyllaDB). Its goal is to reintroduce the way we communicate; not by changing the method by which we do so, but by centralizing the methods of communication into a single framework, which can then be used either with our React frontend which we will ship it with by default, or with a custom client built frontend designed for the usecase at hand.

---

## Getting Started

To clone the repository, run `git clone https://github.com/Vor-Tech/Rift`

### Prerequisites

Make sure you have [Node](https://nodejs.org/en/), [npm](https://www.npmjs.com/get-npm), [Docker](https://www.docker.com/get-started), and MongoDB installed and running on the local network.

- To install and run MongoDB via Docker: `docker run -p 27017:27017 --name MongoDB -d mongo:latest && docker start MongoDB`

  ##### \*Note: Linux users might need to prepend `sudo` before both instances of `docker` or use `root` privileges, and Windows users might require an administrative PowerShell.

### Installing

To install Rift, `cd Rift && npm install`, then, open two separate terminals. In both terminals, make sure you are in the `Rift` directory (located wherever you ran `git clone`). Then, in the first terminal, run `node Server/Express/index.js` and in the second terminal, run `node Server/ws/index.js`

In first terminal:

```bash
cd Rift
npm install
node Server/Express/index.js
```

In second terminal:

```bash
cd Rift
node Server/ws/index.js
```

You can interact with Rift "headless" by using HTTP requests through an application like [Postman](https://www.postman.com/) or [Insomnia Core](https://insomnia.rest/)

## Authors

- **Jonathan Kurtz** - [xero-lib](https://github.com/xero-lib)
- **Roland Metivier** - [Chlorophytus](https://github.com/Chlorophytus)
- **Daniel Lovecraft** - [Technus](https://github.com/Technus)

## License

This project is licensed under a proprietary License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

##### In progress
